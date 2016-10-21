const CampaignAnalyticsLink = require('../../models').campaignanalyticslink;


module.exports = function(req, res) {
  CampaignAnalyticsLink.update(
    { clicked: true },
    {
      where: {
        trackingId: req.query.trackingId,
        clicked: false  // only track the first clickthrough (updatedAt is set automatically)
      }
    }
  )

  res.redirect(req.query.url);
}
