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
    const [accessKey, serviceKey] = yield getAmazonKeys(userId);

    // 2. Confirm the campaign id belongs to the user and retrieve the associated listId
    const campaignInfo = yield campaignBelongsToUser(userId, campaignId);

    // 3. Send the campaign
    yield email.amazon.controller(generator, db.listsubscriber, campaignInfo, accessKey, serviceKey);

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
        console.log(campaignObject);
        const listId = campaignObject.listId;
        const fromEmail = campaignObject.fromEmail;

        generator.next({listId, fromEmail});
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
        // This should never happen
        res.status(500).send();
      } else {
        const accessKey = settingInstance.getDataValue['amazonSimpleEmailServiceAccessKey'];
        const secretKey = settingInstance.getDataValue['amazonSimpleEmailServiceSecretKey'];

        // If either key is blank, the user needs to set their settings
        if (accessKey === '' || secretKey === '') {
          res.status(400).send({message:'Please set your Amazon SES keys'});
        } else {
          generator.next([accessKey, secretKey]);
        }
      }
    }).catch(err => {
      throw err;
    });
  }

}
