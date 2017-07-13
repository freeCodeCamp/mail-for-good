const db = require('../../models');
const email = require('./email');
const AWS = require('aws-sdk');
const moment = require('moment');

module.exports = (req, res, io, redis) => {

  const userId = req.user.id;

  // If req.body.id was not supplied or is not a number, cancel
  if (!req.body.id || typeof req.body.id !== 'number') {
    res.status(400).send();
    return;
  }

  function *sendCampaign() {
    const campaignId = req.body.id;

    // NOTE: Current assumption is that the user is using Amazon SES. Can modularise and change this if necessary.

    // 1. Confirm user has set their keys & retrieve them
    const { accessKey, secretKey, region, whiteLabelUrl } = yield getAmazonKeysAndRegion(userId);

    // 2. Confirm the campaign id belongs to the user and retrieve the associated listId
    const campaignInfo = yield campaignBelongsToUser(userId, campaignId);

    // 3. Get the user's Max24HourSend - SentLast24Hours to determine available email quota, then get MaxSendRate
    const quotas = yield getEmailQuotas(accessKey, secretKey, region);

    // 4. Count the number of list subscribers to message. If this is above the daily quota, send an error.
    const { totalListSubscribers, totalEmailsToSend } = yield countListSubscribers(campaignInfo.listId, quotas.AvailableToday, campaignId);
    console.log(`Total list subscribers: ${totalListSubscribers}\nEmails to send: ${totalEmailsToSend}`); // eslint-disable-line

    // 5. Update analytics data
    campaignInfo.campaignAnalyticsId = yield updateAnalytics(campaignInfo.campaignId, userId, totalEmailsToSend);

    // 6. At this stage, we've ready to send the campaign. Respond that the request was successful.
    res.send(howLongEmailingWillTake(totalEmailsToSend, quotas.AvailableToday, quotas.MaxSendRate, campaignInfo.status));

    // 7. Send the campaign. TODO: Clean up & condense these arguments
    const campaignAndListInfo = {
      campaignInfo,
      totalListSubscribers
    };

    const amazonAccountInfo = {
      accessKey,
      secretKey,
      region,
      whiteLabelUrl,
      quotas
    };

    yield email.amazon.controller(generator, redis, campaignAndListInfo, amazonAccountInfo, io, req);

    // 8. TODO: If there was an error, handle it here

  }

  const generator = sendCampaign();
  generator.next();

  // Validate the campaign belongs to the user
  function campaignBelongsToUser(userId, campaignId) {
    db.campaign.findOne({
      where: {
        id: campaignId,
        userId: userId
      }
    }).then(campaignInstance => {
      if (!campaignInstance) {
        res.status(401).send();
      } else {
        const campaignObject = campaignInstance.get({plain: true});

        // Only send the campaign if it has been freshly created or
        // has been interrupted (resume)
        if (!['ready', 'interrupted'].includes(campaignObject.status)) {
          // Campaign is not ready to send - show appropriate error message
          const errorMessages = {
            sending: 'Your campaign is already being sent',
            done: 'Your campaign has been delivered already',
            creating: 'Your campaign is still being created and will be ready to send soon'
          };
          console.log(errorMessages[campaignObject.status]); // eslint-disable-line
          res.status(400).send({
            message: errorMessages[campaignObject.status]
          });
          return;
        }

        const listId = campaignObject.listId;
        const {
          fromName,
          fromEmail,
          emailSubject,
          emailBody,
          type,
          name,
          trackingPixelEnabled,
          trackLinksEnabled,
          unsubscribeLinkEnabled,
          status
        } = campaignObject;

        generator.next({
          listId,
          fromName,
          fromEmail,
          emailSubject,
          emailBody,
          campaignId,
          type,
          name,
          trackingPixelEnabled,
          trackLinksEnabled,
          unsubscribeLinkEnabled,
          status
        });
      }
    }).catch(err => {
      console.log(err); //eslint-disable-line
    });
  }

  function getAmazonKeysAndRegion(userId) {
    db.setting.findOne({
      where: {
        userId: userId
      }
    }).then(settingInstance => {
      if (!settingInstance) {
        // This should never happen as settings are created on account creation
        res.status(500).send();
      } else {
        const settingObject = settingInstance.get({plain: true});
        const {amazonSimpleEmailServiceAccessKey: accessKey, amazonSimpleEmailServiceSecretKey: secretKey, region, whiteLabelUrl} = settingObject;
        // If either key is blank, the user needs to set their settings
        if ((accessKey === '' || secretKey === '' || region === '') && process.env.NODE_ENV === 'production') {
          res.status(400).send({message: 'Please provide your details for your Amazon account under "Settings".'});
        } else {
          // handling of default whitelabel url?
          generator.next({
            accessKey,
            secretKey,
            region,
            whiteLabelUrl: whiteLabelUrl
          });
          return null;
        }
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  }

  function getEmailQuotas(accessKey, secretKey, region) {
    const ses = new AWS.SES({accessKeyId: accessKey, secretAccessKey: secretKey, region: region});

    ses.getSendQuota((err, data) => {
      if (err) { // Either access keys are wrong here or the request is being placed too quickly
        res.status(400).send({message: 'Please confirm your Amazon SES settings and try again later.'});
      } else {
        const {Max24HourSend, SentLast24Hours, MaxSendRate} = data;
        // If the user's max send rate is 1, they are in sandbox mode.
        // We should let them know and NOT send this campaign
        if (MaxSendRate <= 1) {
          res.status(400).send({message: 'You are currently in Sandbox Mode. Please contact Amazon to get this lifted.'});
          return;
        }
        const AvailableToday = Max24HourSend - SentLast24Hours;
        generator.next({ Max24HourSend, SentLast24Hours, MaxSendRate, AvailableToday });
      }
    });
  }

  function countListSubscribers(listId, AvailableToday, campaignId) {
    let totalListSubscribers,
      totalEmailsToSend;

    db.listsubscriber.count({
      where: {
        listId,
        subscribed: true
      }
    }).then(total => {
      totalListSubscribers = total;
      return db.listsubscriber.count({
        where: {
          listId,
          subscribed: true
        },
        include: [
          {
            model: db.campaignsubscriber,
            where: {
              campaignId,
              sent: false
            }
          }
        ]
      });
    }).then(total => {
      totalEmailsToSend = total;

      if (totalEmailsToSend > AvailableToday && process.env.NODE_ENV === 'production') {
        res.status(400).send({message: `This list exceeds your 24 hour allowance of ${AvailableToday} emails. Please upgrade your SES limit.`});
      } else {
        generator.next({ totalListSubscribers, totalEmailsToSend });
      }
      return null;
    }).catch(err => {
      res.status(500).send(err);
      console.log(err); //eslint-disable-line
    });
  }

  function updateAnalytics(campaignId, userId, totalEmails) {
    const findUserById = db.user.findById(userId)
      .then(foundUser => {
        return foundUser.increment('sentEmailsCount', { by: totalEmails });
      })
      .catch(err => {
        res.status(500).send(err);
        console.log(err); //eslint-disable-line
      });

    const findCampaignAnalytics = findUserById
      .then(() => {
        return db.campaignanalytics.findOne({
          where: {
            campaignId
          }
        });
      })
      .catch(err => {
        res.status(500).send(err);
        console.log(err); //eslint-disable-line
      });

    findCampaignAnalytics
      .then(result => {
        generator.next(result.dataValues.id);
        return null;
      });
  }
};

function howLongEmailingWillTake(totalEmailsToSend, AvailableToday, MaxSendRate, status) {
  MaxSendRate = (MaxSendRate > 35)
    ? 35
    : MaxSendRate; // Cap the max send rate so the estimate is not too optimistic
  const timeTaken = (totalEmailsToSend / MaxSendRate / 60);
  const emailsLeftAfterSend = AvailableToday - totalEmailsToSend;

  let formattedMessage;
  if (status == 'ready') {
    formattedMessage = `Your campaign is being sent to ${totalEmailsToSend.toLocaleString('en-GB')} subscribers, it should be done `;
  } else if (status == 'interrupted') {
    formattedMessage = `Campaign sending resumed - sending to remaining ${totalEmailsToSend.toLocaleString('en-GB')} subscribers, it should be done `;
  }

  const newTime = moment(new Date(new Date().getTime() + timeTaken * 60000));
  const timeTo = moment(new Date).to(newTime);

  formattedMessage += `${timeTo}. `;
  formattedMessage += ` Your Amazon limit for today is now ${emailsLeftAfterSend.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} emails.`;

  return { message: formattedMessage };
}
