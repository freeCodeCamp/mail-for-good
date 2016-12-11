const queue = require('async/queue');
const AWS = require('aws-sdk');
const backoff = require('backoff');

const wrapLink = require('./analytics').wrapLink;
const insertUnsubscribeLink = require('./analytics').insertUnsubscribeLink;
const insertTrackingPixel = require('./analytics').insertTrackingPixel;
const mailMerge = require('./mail-merge');

const db = require('../../../../models');
const AmazonEmail = require('./amazon');
const CampaignSubscriber = require('../../../../models').campaignsubscriber;
const CampaignAnalyticsLink = require('../../../../models').campaignanalyticslink;
const CampaignAnalyticsOpen = require('../../../../models').campaignanalyticsopen;
const CampaignAnalytics = require('../../../../models').campaignanalytics;

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

  TODO: Eventual plan

  > Buffer emails to be sent
  > Send fixed number of emails per second

  Can be implemented when this code is more concrete. As things stand, the send rate is determined by db latency.

*/

module.exports = (generator, ListSubscriber, campaignInfo, accessKey, secretKey, quotas, totalListSubscribers, region, whiteLabelUrl) => {


  const isDevMode = process.env.NODE_ENV === 'development' || false;

  let rateLimit = process.env.DEV_SEND_RATE || quotas.MaxSendRate; // The number of emails to send per second
  let pushByRateLimitInterval = 0;
  let listCalls = 0;
  let processedEmails = 0;
  let isBackingOff = false;
  let isRunning = false; // eslint-disable-line

  let ListSubscriberIndexPointer = 0;

  const backoffExpo = backoff.exponential({ // Exp backoff for throttling errs - see https://github.com/MathieuTurcotte/node-backoff
    initialDelay: 3000,
    maxDelay: 120000
  });

  const ses = isDevMode
    ? new AWS.SES({ accessKeyId: accessKey, secretAccessKey: secretKey, region, endpoint: 'http://localhost:9999' })
    : new AWS.SES({ accessKeyId: accessKey, secretAccessKey: secretKey, region });

  ///////////
  // Queue //
  ///////////

  const q = queue((task, done) => {

    // Clone the campaign info object so that we can add per-campaign
    // analytics stuff (unsubscribe, link tracking, open tracking)
    let updatedCampaignInfo = Object.assign({}, campaignInfo);

    CampaignAnalyticsLink.create({
      trackingId: campaignInfo.trackingId,
      campaignanalyticId: campaignInfo.campaignAnalyticsId,  // consider refactoring these?
      listsubscriberId: task.id
    }).then(newCampaignAnalyticsLink => {
      if (campaignInfo.trackLinksEnabled) {
        updatedCampaignInfo.emailBody = wrapLink(campaignInfo.emailBody, newCampaignAnalyticsLink.dataValues.trackingId, campaignInfo.type, whiteLabelUrl);
      }

      return CampaignAnalyticsOpen.create({
        campaignanalyticId: campaignInfo.campaignAnalyticsId,
        listsubscriberId: task.id
      });
    }).then(newCampaignAnalyticsOpen => {
      if (campaignInfo.trackingPixelEnabled) {
        updatedCampaignInfo.emailBody = insertTrackingPixel(updatedCampaignInfo.emailBody, newCampaignAnalyticsOpen.dataValues.trackingId, campaignInfo.type);
      }

      if (campaignInfo.unsubscribeLinkEnabled) {
        updatedCampaignInfo.emailBody = insertUnsubscribeLink(updatedCampaignInfo.emailBody, task.unsubscribeKey, campaignInfo.type, whiteLabelUrl);
      }

      updatedCampaignInfo.emailBody = mailMerge(task, updatedCampaignInfo);

      const emailFormat = AmazonEmail(task, updatedCampaignInfo);

      ses.sendEmail(emailFormat, (err, data) => {
        // NOTE: Data contains only data.messageId, which we need to get the result of the request in terms of success/bounce/complaint etc from Amazon later
        if (err && !isDevMode) {
          handleError(err, done, task);
        } else {

          // Save the SES message ID so we can find its status later (bounced, recv, etc)
          // ~ Using the email field here is a bit of a hack, please change me
          CampaignSubscriber.update(
            { messageId: data.MessageId, sent: true },
            {
              where: { listsubscriberId: task.id },
              limit: 1
            }
          ).then(() => {
            CampaignAnalytics.findById(campaignInfo.campaignAnalyticsId).then(foundCampaignAnalytics => {
              foundCampaignAnalytics.increment('totalSentCount').then(() => {
                done(); // Accept new email from pool
                processedEmails++;
              });
            });
          });
        }
      });
    });
  }, rateLimit);

  const pushToQueue = list => {
    q.push(list, err => {
        if (err)
          throw err;
      }
    );
  };

  ///////////
  // Error //
  ///////////

  function handleError(err, done, task) {
    switch(err.code) {
      case 'Throttling':
        handleThrottlingError(done, task);
        break;
      default: // Failsafe that discards the email. Should not occur as errors should be caught by handlers.
        done();
        // saveAnalysisEmail(task.email, null);
    }
  }

  function handleThrottlingError(done, task) {
    // Too many responses send per second. Handle error by reducing sending rate.
    if (!isBackingOff) {
      backoffExpo.backoff();
    }
    pushToQueue(task);
    done();
  }

  backoffExpo.on('backoff', () => {
    // Stop interval, pause queue & reduce rateLimit
    isBackingOff = true;
    clearInterval(pushByRateLimitInterval);
    isRunning = false;

    q.pause();
    rateLimit = Math.floor(rateLimit - (rateLimit / 10)) > 0 ? Math.floor(rateLimit - (rateLimit / 10)) : 1;
  });

  backoffExpo.on('ready', () => {
    q.resume();
    setTimeout(() => { // Wait for 2 seconds for the queue buffer to clear, then resume
      pushByRateLimit();
      isBackingOff = false;
    }, 2000);
  });

  backoffExpo.on('fail', () => {
    // Shouldn't happen but does need to be handled
  });

  ///////////
  ///////////

  ///////////
  // Calls //
  ///////////

  const returnList = (id) => {
    listCalls++;
    db.listsubscriber.findOne({
      where: {
        id,
        listId: campaignInfo.listId,
        subscribed: true
      }
    }).then(list => {
      if (list) {

        pushToQueue(list.get({ plain:true }));
      }
    }).catch(err => {
      throw err;
    });
  };

  function pushByRateLimit() {
    isRunning = true;
    pushByRateLimitInterval = setInterval(() => {
      if (totalListSubscribers > listCalls) {
        if (q.length() <= rateLimit && !(listCalls > (processedEmails + rateLimit))) { // Prevent race condition where requests to returnList vastly exceed & overwhelm other db requests
          returnList(ListSubscriberIndexPointer);
          ListSubscriberIndexPointer++;
        }
      } else {
        console.timeEnd('sending'); // eslint-disable-line
        generator.next(null);
        clearInterval(pushByRateLimitInterval);
      }
    }, (1000 / rateLimit));
  }

  const getInitialListSubscriberId = () => {
    return db.listsubscriber.findOne({
      where: {
        listId: campaignInfo.listId
      },
      order: [ ['id', 'ASC'] ],
      raw: true
    }).then(list => {
      return startGenerator.next(list.id);
    }).catch(err => {
      throw err;
    });
  };

  function *startSending() {
    console.time('sending'); // eslint-disable-line
    ListSubscriberIndexPointer = yield getInitialListSubscriberId();
    pushByRateLimit();
  }

  const startGenerator = startSending();
  startGenerator.next();

};
