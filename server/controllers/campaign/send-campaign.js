const db = require('../../models');
const email = require('./email');

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
    const { accessKey, secretKey } = yield getAmazonKeys(userId);

    // 2. Confirm the campaign id belongs to the user and retrieve the associated listId
    const campaignInfo = yield campaignBelongsToUser(userId, campaignId);

    // 3. At this stage, we've confirmed that the user's request is authentic. Respond that the request was successful.
    res.send({ message: 'Your emails are being sent! We\'ll notify you when this is done.' })

    // 4. Send the campaign
    yield email.amazon.controller(generator, db.listsubscriber, campaignInfo, accessKey, secretKey);

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
        campaignObject = campaignInstance.get({ plain:true });
        const listId = campaignObject.listId;
        const fromEmail = campaignObject.fromEmail;

        generator.next({ listId, fromEmail });
      }
    }).catch(err => {
      throw err;
    });
  }

  function getAmazonKeys(userId) {
    db.setting.findOne({
      where: {
        userId: userId
      }
    }).then(settingInstance => {
      if (!settingInstance) {
        // This should never happen as settings are created on account creation
        res.status(500).send();
      } else {
        settingObject = settingInstance.get({ plain:true });

        const accessKey = settingObject.amazonSimpleEmailServiceAccessKey;
        const secretKey = settingObject.amazonSimpleEmailServiceSecretKey;

        // If either key is blank, the user needs to set their settings
        if (accessKey === '' || secretKey === '') {
          res.status(400).send({message:'Please provide your details for your Amazon account under "Settings".'});
        } else {
          generator.next({ accessKey, secretKey });
        }
      }
    }).catch(err => {
      throw err;
    });
  }

}
