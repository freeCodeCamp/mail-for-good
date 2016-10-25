const db = require('../../models');
const email = require('./email');
const AWS = require('aws-sdk');

// TODO: Validate contents abide to Amazon's limits https://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html

module.exports = (req, res) => {

  // If req.body.id was not supplied or is not a number, cancel
  if (!req.body.id || typeof req.body.id !== 'number') {
    res.status(400).send();
    return;
  }

  function *sendCampaign() {
    const userId = req.user.id;
    const campaignId = req.body.id;

    // NOTE: Current assumption is that the user is using Amazon SES. Can modularise and change this if necessary.

    // 1. Confirm user has set their keys & retrieve them
    const { accessKey, secretKey, region } = yield getAmazonKeysAndRegion(userId);

    // 2. Confirm the campaign id belongs to the user and retrieve the associated listId
    const campaignInfo = yield campaignBelongsToUser(userId, campaignId);

    // 3. Get the user's Max24HourSend - SentLast24Hours to determine available email quota, then get MaxSendRate
    const quotas = yield getEmailQuotas(accessKey, secretKey);

    // 4. Count the number of list subscribers to message. If this is above the daily quota, send an error.
    const totalListSubscribers = yield countListSubscribers(campaignInfo.listId, quotas.AvailableToday);

    // 5. Update analytics data
    campaignInfo.campaignAnalyticsId = yield updateAnalytics(campaignInfo.campaignId, userId, totalListSubscribers);

    // 6. At this stage, we've ready to send the campaign. Respond that the request was successful.
    res.send(howLongEmailingWillTake(totalListSubscribers, quotas.AvailableToday, totalListSubscribers));

    // 7. Send the campaign. TODO: Clean up & condense these arguments
    yield email.amazon.controller(generator, db.listsubscriber, campaignInfo, accessKey, secretKey, quotas, totalListSubscribers, region);

    // 8. If there was an error preventing emails from being sent, send it here. Otherwise, TODO: push a notification
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
        const campaignObject = campaignInstance.get({ plain:true });
        const listId = campaignObject.listId;
        const { fromName, fromEmail, emailSubject, emailBody, type } = campaignObject;

        generator.next({ listId, fromName, fromEmail, emailSubject, emailBody, campaignId, type });
      }
    }).catch(err => {
      throw err;
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
        const settingObject = settingInstance.get({ plain:true });
        const { accessKey, secretKey, region } = settingObject;
        // If either key is blank, the user needs to set their settings
        if (accessKey === '' || secretKey === '' || region === '' && !process.env.IS_DEV_MODE) {
          res.status(400).send({ message:'Please provide your details for your Amazon account under "Settings".' });
        } else {
          generator.next({ accessKey, secretKey, region });
        }
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  }

  function getEmailQuotas(accessKey, secretKey) {
    const ses = new AWS.SES({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: `eu-west-1` //TODO: Get this from the client
    });

    ses.getSendQuota((err, data) => {
      if (err && !process.env.DEV_SEND_RATE) { // Either access keys are wrong here or the request is being placed too quickly
        res.status(400).send({ message: 'Please confirm your Amazon SES settings and try again later.' });
      } else {
        const { Max24HourSend, SentLast24Hours, MaxSendRate } = data;
        const AvailableToday = Max24HourSend - SentLast24Hours;
        generator.next({ Max24HourSend, SentLast24Hours, MaxSendRate, AvailableToday });
      }
    });
  }

  function countListSubscribers(listId, AvailableToday) {
    db.listsubscriber.count({
      where: {
        listId: listId,
        subscribed: true
      }
    }).then(total => {
      if (total > AvailableToday && !process.env.IS_DEV_MODE) {
        res.status(400).send({ message: `This list exceeds your 24 hour allowance of ${AvailableToday} emails. Please upgrade your SES limit.` });
      } else {
        generator.next(total);
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  }

  function updateAnalytics(campaignId, userId, totalEmails) {
    db.user.findById(
      userId
    ).then(foundUser => {
      return foundUser.increment('sentEmailsCount', { by: totalEmails });
    }).then(() => {
      return db.campaignanalytics.update(
        {totalSentCount: totalEmails},
        {
          where: {campaignId},
          returning: true
        });
    }).then(result => {
      generator.next(result[1][0].id);
    }).catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
  }

  function howLongEmailingWillTake(totalListSubscribers, AvailableToday) {
    const timeTaken = (totalListSubscribers / 14 / 60);
    const emailsLeftAfterSend = AvailableToday - totalListSubscribers;
    let formattedMessage = 'Your email is being sent, it should take ';

    if (timeTaken < 1) { // Less than a minute
      formattedMessage += 'less than a minute.';
    } else if (timeTaken > 1 && timeTaken < 60) { // More than a minute, less than an hour
      formattedMessage += `around ${Math.floor(timeTaken)} minute${Math.floor(timeTaken) === 1 ? '' : 's'}.`;
    } else if (timeTaken >= 60) { // An hour or more
      formattedMessage += `around ${(timeTaken / 60).toFixed(1)} hours.`;
    } else { // Shouldn't fire
      formattedMessage += 'some time.';
    }

    formattedMessage += ` Your Amazon limit for today is now ${emailsLeftAfterSend} emails.`;

    return { message: formattedMessage };
  }

};
