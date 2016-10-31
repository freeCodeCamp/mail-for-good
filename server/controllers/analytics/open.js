const uaParser = require('ua-parser-js');
const geoip = require('geoip-lite');

const CampaignAnalyticsOpen = require('../../models').campaignanalyticsopen;
const CampaignAnalytics = require('../../models').campaignanalytics;


module.exports = function(req, res) {
  CampaignAnalyticsOpen.findOne({
    where: {
      trackingId: req.query.trackingId,
      clicked: false
    }
  }).then(foundCampaignAnalyticsOpen => {
    // only track the first open (updatedAt is set automatically)
    if (foundCampaignAnalyticsOpen) {
      foundCampaignAnalyticsOpen.clicked = true;

      // Attempt to get ip
      const ipAddress = req.headers['x -forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      foundCampaignAnalyticsOpen.ipAddress = ipAddress;

      // Attempt ip geolocation using MaxMind db
      const geoLocation = geoip.lookup(ipAddress);
      if (geoLocation) {  // If the IP address was not found, the lookup returns null
        foundCampaignAnalyticsOpen.country = geoLocation.country;
        foundCampaignAnalyticsOpen.region = geoLocation.region;
        foundCampaignAnalyticsOpen.city = geoLocation.city;
      }

      // Parse headers
      const headers = uaParser(req.headers['user-agent']);
      foundCampaignAnalyticsOpen.browserName = headers.browser.name;
      foundCampaignAnalyticsOpen.deviceVendor = headers.device.vendor;
      foundCampaignAnalyticsOpen.deviceType = headers.device.type;
      foundCampaignAnalyticsOpen.operatingSystem = headers.os.name;

      foundCampaignAnalyticsOpen.save().then(result => {
        CampaignAnalytics.findById(foundCampaignAnalyticsOpen.campaignanalyticId).then(foundCampaignAnalytics => {
          foundCampaignAnalytics.increment('openCount').then(result => {
            console.log("saved");
          });
        });
      });
    }
  })

  res.status(200).send('pixel');
}
