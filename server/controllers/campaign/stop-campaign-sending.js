const {
  // sequelize,
  campaign: Campaign
} = require('../../models');


module.exports = (req, res, redis) => {

  // If req.body.id was not supplied or is not a number, cancel
  if (!req.body.id || typeof req.body.id !== 'number') {
    res.status(400).send();
    return;
  }
  const userId = req.user.id;
  const campaignId = req.body.id;

  Campaign.findOne({
    where: {
      userId,
      id: campaignId
    },
    raw: true
  }).then(campaign => {
    if (campaign) {
      redis.publisher.publish('stop-campaign-sending', campaignId);

      Campaign.update({ status: 'interrupted' }, {
        where: { userId, id: campaignId }
      }).then(() => {
        res.send();
      });
    } else {
      res.status(400).send();
    }
  });
};
