/*

https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html
success@simulator.amazonses.com (Successful email)
bounce@simulator.amazonses.com (Soft bounce)
ooto@simulator.amazonses.com (Out of office response from ISP)
complaint@simulator.amazonses.com (Complaint from ISP)
suppressionlist@simulator.amazonses.com (Hard bounce as target email is on Amazon's suppression list)

API endpoints
US East (N. Virginia)	us-east-1
US West (Oregon)	us-west-2
EU (Ireland)	eu-west-1

Successful response has form:
{ ResponseMetadata: { RequestId: 'e8a3d6b4-94fd-11z6-afac-757cax279ap5' },
  MessageId: '01020157a1261241-90a5e1cd-3a5z-4sb7-1r41-957a4cae8e58-000000' }
Throttling error:
{ Throttling: Maximum sending rate exceeded.
    at ...
  message: 'Maximum sending rate exceeded.',
  code: 'Throttling',
  time: 2016-10-18T07:50:11.286Z,
  requestId: '7f2d1781-9507-11e6-8885-675506266ba7',
  statusCode: 400,
  retryable: true }

*/

const AWS = require('aws-sdk');
const Promise = require('bluebird'); // Bluebird is signficantly faster than native promises

const wrapLink = require('./analytics').wrapLink;
const insertUnsubscribeLink = require('./analytics').insertUnsubscribeLink;
const insertTrackingPixel = require('./analytics').insertTrackingPixel;
const mailMerge = require('./mail-merge');

const db = require('../../../../models');
const AmazonEmail = require('./amazon');
const CampaignAnalyticsLink = require('../../../../models').campaignanalyticslink;
const CampaignAnalyticsOpen = require('../../../../models').campaignanalyticsopen;

module.exports = (generator, listSubscriberModel, redis, campaignAndListInfo, amazonAccountInfo) => {
  /*
    # Send emails via Amazon SES' API #
    This function focuses on a tradeoff between speed and memory usage. It does the following:
      1. Get all ids (and only ids) of listsubscriber rows containing emails to be sent. We don't want any more info
         than this else memory use will be very large.
      2. Prepare emails to be sent, creating entries in various tables and configuring the email itself. Do this in
         batches.
      3. Sen
  */

  // Unpack args
  const {
    campaignInfo, // See object passed by send-campaign.js, contains info about the campaigns table
    // totalListSubscribers // num - the total number of list subscribers to be emailed
  } = campaignAndListInfo;

  const {
    accessKey, // Amazon access key - str
    secretKey, // Amazon secret key - str
    region, // Amazon region - str
    whiteLabelUrl, // URL of a service that serves this app - str
    quotas // Amazon limits - obj { AvailableToday, MaxSendRate }
  } = amazonAccountInfo;

  // Constants
  const isDevMode = process.env.NODE_ENV === 'development';
  const rateLimit = process.env.DEV_SEND_RATE || quotas.MaxSendRate; // No. of email we can send p/s as established by Amazon
  const rateLimitTimesFive = rateLimit * 5; // Arbitrary quantity of emails to store in buffer
  const emailBuffer = []; // This stores the current buffer of emails to be sent

  const ses = isDevMode
    ? new AWS.SES({  // Dev mode
        apiVersion: '2010-12-01',
        // convertResponseTypes: false,
        maxRetries: 0,
        accessKeyId: accessKey,
        secretAccessKey:
        secretKey,
        region,
        endpoint: 'http://localhost:9999'
      })
    : new AWS.SES({ // Prod mode
        apiVersion: '2010-12-01',
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
        region
      });

  // Vars
  let databaseIsWorking = false; // This is a flag that will ensure that the db does not get assigned too much work
  let shouldSend = true; // Another flag that indicates whether or not a campaign should send

  const Producer = require('../message-queue/amazon/producer')();
  const Receiver = require('../message-queue/amazon/receiver')(ses, rateLimit, campaignInfo);

  (async function sendEmailsViaAmazon() {
    // 1. First we'll get an array containing the ids of all users we're going to email.
    //// This way we have the certainty of knowing who to email without the memory footprint
    //// associated with including all other columns.
    console.log(`\nEmail campaign send initiated. Sending ${rateLimit} per second.\n`); // eslint-disable-line
    updateCampaignStatus();
    console.log('Preparing to send email campaign. Getting list subscribers ids ...'); // eslint-disable-line
    const arrayOfIds = await getListSubscriberIds(); // Returns ids from listsubscribers [1,2,3, ... etc]
    const initialBuffer = await fillInitialBuffer(arrayOfIds); // Initialise the buffer
    emailBuffer.push(...initialBuffer);
    if (isDevMode) console.log(`Filled emailBuffer with ${emailBuffer.length} emails`); // eslint-disable-line
    // 2. Listen for cancellation event
    redis.subscriber.on('message', (channel, campaignId) => {
      if (campaignId == campaignInfo.campaignId) {
        cancel();
      }
    });
    redis.subscriber.subscribe('stop-campaign-sending');
    // 3. Fill the buffer with an initial set of emails
    emailProducer(arrayOfIds, rateLimit);
  })();

  function updateCampaignStatus() {
    db.campaign.update({
      status: 'sending'
    }, {
      where: {
        id: campaignInfo.campaignId
      }
    }).catch(err => {throw err;});
  }

  function getListSubscriberIds() {
    return listSubscriberModel.findAll({
      where: {
        listId: campaignInfo.listId,
        subscribed: true
      },
      include: [{
        model: db.campaignsubscriber,
        where: { sent: false }
      }],
      attributes: [
        'id'
      ],
      raw: true
    })
    .then(instances => { // [{id: 1}, {id: 2}, etc]
      const plainArrayOfIdNumbers = instances.map(x => x.id);
      return plainArrayOfIdNumbers;
    })
    .catch(err => {
       console.log(err); //eslint-disable-line
    });
  }

  function getEmailsAndCampaignInfo(arrayOfIds, rateLimit) {
    // This function is tasked with getting and therefore preparing all information needed to send
    //// an email via Amazon SES. This also means creating tracking information in the database.
    //// Returns an array of arg rateLimit of [emails] and [campaignInfo]
    //// Each email index contains the full listsubscriber + campaignsubscriber info

    // If rateLimit = 0, return
    if (rateLimit === 0) {
      return Promise.resolve();
    }

    try {
      const arrayOfEmailIds = [];
      const campaignInfoArray = []; // An array of [{c}] of length rateLimit_or_arrayOfIdsLength
      const arrayOfIdsLength = arrayOfIds.length;
      const rateLimit_or_arrayOfIdsLength = arrayOfIdsLength < rateLimit ? arrayOfIdsLength : rateLimit;

      // Note that the code below intentionally mutates the arrayOfIds argument
      for (let i = 0; i < rateLimit_or_arrayOfIdsLength; i++) {
        arrayOfEmailIds.push(arrayOfIds.shift()); // [1, 2, ...]
        campaignInfoArray.push(Object.assign({}, campaignInfo)); // [{campaignInfo}, {campaignInfo}, ...]
      }

      // 1. Get listSubscribers & join campaignSubscribers
      //// Returns array of [{ listsubscriber + campaignsubscriber}, ...] of length rateLimit_or_arrayOfIdsLength
      const listPromise = listSubscriberModel.findAll({
        where: {
          id: {
            in: arrayOfEmailIds
          },
          subscribed: true
        },
        include: [
          {
            model: db.campaignsubscriber,
            where: {
              listsubscriberId: {
                in: arrayOfEmailIds
              }
            },
            raw: true
          }
        ],
        raw: true
      })
      .then(instances => {
        // Instances are raw objects
        return instances;
      })
      .catch(err => {
        console.log(err); //eslint-disable-line
      });

      // 2. Create CampaignAnalyticsLink, CampaignAnalyticsOpen

      const campaignPromise = listPromise
        .then(listSubsAndCampSubs => {
          // 2.1 Create a campaignAnalyticsLink for each listSubsAndCampSub, and add info to campaignInfoArray
          listSubsAndCampSubs.forEach((sub, index) => {
            if (campaignInfo.unsubscribeLinkEnabled) {
              campaignInfoArray[index].emailBody = insertUnsubscribeLink(campaignInfoArray[index].emailBody, sub.unsubscribeKey, campaignInfo.type, whiteLabelUrl);
            }
            campaignInfoArray[index].emailBody = mailMerge(sub, campaignInfoArray[index]);
          });

          const caLinks = listSubsAndCampSubs.map(sub => ({
              trackingId: campaignInfo.trackingId,
              campaignanalyticId: campaignInfo.campaignAnalyticsId,  // consider refactoring these?
              listsubscriberId: sub.id
          }));

          // 2.2 Create the campaignAnalyticsOpens rows
          const p1 = CampaignAnalyticsLink.bulkCreate(caLinks)
            .then(newCALinstances => {
              const rawCAL = newCALinstances.filter(x => x.get());
              const caOpens = rawCAL.map((link, index) => {
                // Create rateLimit_or_arrayOfIdsLength no. of trackLinksEnabled props
                if (campaignInfo.trackLinksEnabled) {
                  campaignInfoArray[index].emailBody = wrapLink(campaignInfo.emailBody, link.trackingId, campaignInfo.type, whiteLabelUrl);
                }

                return {
                  campaignanalyticId: campaignInfo.campaignAnalyticsId,
                  listsubscriberId: link.id
                };
              });

              return CampaignAnalyticsOpen.bulkCreate(caOpens);
            });

          // 2.3 One the CampaignAnalyticsLink and CampaignAnalyticsOpen has been created, insert info into
          //// updatedCampaignInfo if necessary.
          const p2 = p1.then(newCAOinstances => {
            const rawCAO = newCAOinstances.filter(x => x.get());
            // Insert trackling label
            rawCAO.forEach((open, index) => {
              if (campaignInfo.trackingPixelEnabled) {
                campaignInfoArray[index].emailBody = insertTrackingPixel(campaignInfoArray[index].emailBody, rawCAO.trackingId, campaignInfo.type, whiteLabelUrl);
              }
            });

            return null;
          });

          return Promise.all([p1, p2])
            .then(() => campaignInfoArray);
      });

      return Promise.all([listPromise, campaignPromise])
        .then(values => {
          const [l, c] = values; // List subscriber & campaign info arrays
          // Format each email & return
          const emailFormatArray = l.map((sub, index) => AmazonEmail(sub, c[index]));
          databaseIsWorking = false;
          return emailFormatArray;
        });
    } catch (err) {
      console.log(err); //eslint-disable-line
    }
  }

  function fillInitialBuffer(arrayOfIds) {
    if (isDevMode) console.log(`Filling email buffer ...`); // eslint-disable-line
    return getEmailsAndCampaignInfo(arrayOfIds, rateLimitTimesFive)
      .then(emailFormatArray => {
        return emailFormatArray;
      });
  }

  function maintainEmailBuffer(arrayOfIds) {
    // This function maintains the closure's 'emailBuffer' var, ensuring it contains
    //// rateLimit * 5 formatted emails.
    const emailBufferLength = emailBuffer.length;
    const arrayOfIdsLength = arrayOfIds.length;
    if (isDevMode) console.log('Calling maintainEmailBuffer...'); // eslint-disable-line

    // If emailBufferLength & arrayOfIdsLength === 0, email send is done
    if (emailBufferLength === 0 && arrayOfIdsLength === 0) {
      success();
      return;
    }

    // Case 1 - email buffer contains 1/2 rateLimitTimesFive
    if ((emailBufferLength <= arrayOfIdsLength) && (emailBufferLength <= rateLimitTimesFive / 2) && !databaseIsWorking) {
      databaseIsWorking = true;
      getEmailsAndCampaignInfo(arrayOfIds, rateLimitTimesFive / 2)
        .then(emailFormatArray => {
          if (isDevMode) console.log('--- Case 1 initiated'); // eslint-disable-line
          emailBuffer.push(...emailFormatArray);
        })
        .catch(err => console.log(err)); // eslint-disable-line
    }
    // Case 2 - emailBufferLength is > arrayOfIds. This means that we can process the final batch of arrayOfIds
    else if (emailBufferLength > arrayOfIdsLength && arrayOfIdsLength && !databaseIsWorking) {
      databaseIsWorking = true;
      getEmailsAndCampaignInfo(arrayOfIds, arrayOfIdsLength)
        .then(emailFormatArray => {
          if (isDevMode) console.log('--- Case 2 initiated'); // eslint-disable-line
          emailBuffer.push(...emailFormatArray);
        })
        .catch(err => console.log(err)); // eslint-disable-line
    }

    if (isDevMode) console.log(`\n# maintainEmailBuffer function reports emailBufferLength - ${emailBufferLength} & arrayOfIdsLength - ${arrayOfIdsLength} & rateLimitTimesFive - ${rateLimitTimesFive}`); // eslint-disable-line

    // Finally - call emailProducer after 1s
    const ONE_SECOND = 1000;
    (function shouldProduceMoreEmails() {
      setTimeout(() => {
        Receiver.count()
          .then(receiverQueueLength => { // The number of items currently being processed by the receiver
            // If the receiver is processing >= rateLimitTimesFive emails, postpone calling them
            if (isDevMode) console.log(`receiverQueueLength: ${receiverQueueLength} - ${receiverQueueLength >= rateLimitTimesFive ? 'postponing' : 'continuing'}`); // eslint-disable-line
            if (receiverQueueLength >= rateLimitTimesFive) {
              shouldProduceMoreEmails();
            } else {
              if (shouldSend)
                emailProducer(arrayOfIds, rateLimit);
            }
          });
      }, ONE_SECOND);
    })();
  }

  function emailProducer(arrayOfIds, rateLimit) {
    // This function will produce 'rateLimit' no. of email p/s
    //// It is recursive and below is a base case of sorts
    const arrayOfIdsLength = arrayOfIds.length;
    const emailBufferLength = emailBuffer.length;
    // arrayOfIds is now empty & the emailBuffer has been cleared
    if (arrayOfIdsLength === 0 && emailBufferLength === 0) {
      return; // Email sending complete
    }
    if (isDevMode) console.log(`emailProducer called, arrayOfIdsLength: ${arrayOfIdsLength} - emailBufferLength: ${emailBufferLength}`); // eslint-disable-line

    // The constant below contains either the rateLimit or arrayOfIdsLength, whichever is lowest
    const numberOfEmailsToSplice = rateLimit > arrayOfIdsLength ? (arrayOfIdsLength == 0 ? 1 : arrayOfIdsLength) : rateLimit;
    const splicedEmails = emailBuffer.splice(0, numberOfEmailsToSplice);

    if (isDevMode) console.log(`splicedEmailsLength: ${splicedEmails.length} - tried to splice ${numberOfEmailsToSplice} elements from emailBuffer of length: ${emailBufferLength}`); // eslint-disable-line

    // At this point, emailBuffer contains rateLimit fewer emails.
    splicedEmails.forEach(emailFormat => {
      Producer.add(emailFormat);
    });

    // Emails have now been placed in the queue for processing. Now we can maintain the buffer:
    if (shouldSend)
      maintainEmailBuffer(arrayOfIds);
  }

  function finish(error) {
    const status = shouldSend ? 'interrupted' : 'done';
    db.campaign.update({
      status
    }, {
      where: {
        id: campaignInfo.campaignId
      }
    });
    generator.next(error);
  }

  function success() {
    console.log('\nFinished sending campaign\n'); // eslint-disable-line
    Producer.close();
    Receiver.close();
    finish(null);
  }

  function cancel() {
    shouldSend = false;
    Producer.close();
    Receiver.close();
    redis.subscriber.unsubscribe('stop-campaign-sending');
    finish('cancelled');
  }
};
