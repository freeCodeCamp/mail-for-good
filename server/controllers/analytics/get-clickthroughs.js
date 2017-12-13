const Campaign = require('../../models').campaign;
const CampaignAnalytics = require('../../models').campaignanalytics;
const CampaignAnalyticsLink = require('../../models').campaignanalyticslink;

// Temporary route for getting clickthrough data
// Will later integrate this into subscriber/campaign/list routes
// ~ at the moment it only gets CTR per campaign
module.exports = function(req, res) {
  const campaignId = req.query.campaignId;
  const userId = req.user.id;

  Campaign.findOne({
    where: {id: campaignId, userId},
    include: [{model: CampaignAnalytics, include: [{model: CampaignAnalyticsLink}]}]
  }).then(result => {
    console.log(result);
    if (result) {
      res.send(result.campaignanalytic.campaignanalyticslinks);
    } else {
      res.status(400).send('you do not have permissions or this campaign does not exist')
    }
  })
}
