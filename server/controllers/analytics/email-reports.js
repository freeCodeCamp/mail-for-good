const Campaign = require('../../models').campaign;
const CampaignSubscriber = require('../../models').campaignsubscriber;

// Temporary route for getting sent email feedback data for a campaign
module.exports = function(req, res) {
  const campaignId = req.query.campaignId;
  const userId = req.user.id;

  Campaign.findOne({
    where: { id: campaignId, userId },
    include: [ { model: CampaignSubscriber } ]
  }).then(result => {
    if (result) {
      res.send(result.campaignsubscribers);
    } else {
      res.status(400).send('you do not have permissions or this campaign does not exist')
    }
  })
}
