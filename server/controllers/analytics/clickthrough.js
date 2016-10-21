const CampaignAnalyticsLink = require('../../models').campaignanalyticslink;


module.exports = function(req, res) {

  CampaignAnalyticsLink.findOne({
    where: {
      trackingId: req.query.trackingId,
      clicked: false
    }
  }).then(foundCampaignAnalyticsLink => {
    // only track the first clickthrough (updatedAt is set automatically)
    if (foundCampaignAnalyticsLink) {
      console.log("doing stuff");
      const ipAddress = req.headers['x -forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      foundCampaignAnalyticsLink.ipAddress = ipAddress;
      foundCampaignAnalyticsLink.clicked = true;
      foundCampaignAnalyticsLink.save().then(result => {
        console.log("saved");
      });
    }
  })

  res.redirect(req.query.url);
}
