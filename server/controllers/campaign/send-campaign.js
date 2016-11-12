const db = require('../../models');
const email = require('./email');
const AWS = require('aws-sdk');

// TODO: Validate contents abide to Amazon's limits https://docs.aws.amazon.com/ses/latest/DeveloperGuide/limits.html

module.exports = (req, res, io) => {

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
    const { accessKey, secretKey, region, whiteLabelUrl } = yield getAmazonKeysAndRegion(userId);

    // 2. Confirm the campaign id belongs to the user and retrieve the associated listId
    const campaignInfo = yield campaignBelongsToUser(userId, campaignId);

    // 3. Get the user's Max24HourSend - SentLast24Hours to determine available email quota, then get MaxSendRate
    const quotas = yield getEmailQuotas(accessKey, secretKey, region);

    // 4. Count the number of list subscribers to message. If this is above the daily quota, send an error.
    const totalListSubscribers = yield countListSubscribers(campaignInfo.listId, quotas.AvailableToday);

    // 5. Update analytics data
    campaignInfo.campaignAnalyticsId = yield updateAnalytics(campaignInfo.campaignId, userId, totalListSubscribers);

    // 6. At this stage, we've ready to send the campaign. Respond that the request was successful.
    res.send(howLongEmailingWillTake(totalListSubscribers, quotas.AvailableToday, quotas.MaxSendRate));

    // 7. Send the campaign. TODO: Clean up & condense these arguments
    yield email.amazon.controller(generator, db.listsubscriber, campaignInfo, accessKey, secretKey, quotas, totalListSubscribers, region, whiteLabelUrl);

    // 8. TODO: If there was an error, handle it here

    // 9. Push a notification regarding the success of the operation
    const emailSuccess = {
      message: `Campaign "${campaignInfo.name}" has been sent`,
      icon: 'fa-envelope',
      iconColour: 'text-green'
    };
    io.sockets.connected[req.session.passport.socket].emit('notification', emailSuccess);
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
        const { fromName, fromEmail, emailSubject, emailBody, type, name } = campaignObject;

        generator.next({ listId, fromName, fromEmail, emailSubject, emailBody, campaignId, type, name });
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
        const {
          amazonSimpleEmailServiceAccessKey: accessKey,
          amazonSimpleEmailServiceSecretKey: secretKey,
          region,
          whiteLabelUrl
        } = settingObject;
        // If either key is blank, the user needs to set their settings
        if (accessKey === '' || secretKey === '' || region === '' && !process.env.IS_DEV_MODE) {
          res.status(400).send({ message:'Please provide your details for your Amazon account under "Settings".' });
        } else {
          // handling of default whitelabel url?
          generator.next({ accessKey, secretKey, region, whiteLabelUrl: whiteLabelUrl || 'http://localhost:8080' });
        }
      }
    }).catch(err => {
      res.status(500).send(err);
    });
  }

  function getEmailQuotas(accessKey, secretKey, region) {
    const ses = new AWS.SES({
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: region
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
      return db.campaignanalytics.findOne(
        { where: { campaignId } }
      );
    }).then(result => {
      generator.next(result.dataValues.id);
    }).catch(err => {
      console.log(err);
      res.status(500).send(err);
    });
  }

  function howLongEmailingWillTake(totalListSubscribers, AvailableToday, MaxSendRate) {
    const timeTaken = (totalListSubscribers / MaxSendRate / 60);
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
