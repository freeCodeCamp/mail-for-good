const uaParser = require('ua-parser-js');
const geoip = require('geoip-lite');

const CampaignAnalyticsLink = require('../../models').campaignanalyticslink;
const CampaignAnalytics = require('../../models').campaignanalytics;

console.log("Clickthrough tracking: Make sure that geoip data has been downloaded: ")
console.log("   $ cd node_modules/geoip-lite")
console.log("   $ npm run-script updatedb")


module.exports = function(req, res) {
  CampaignAnalyticsLink.findOne({
    where: {
      trackingId: req.query.trackingId,
      clicked: false
    }
  }).then(foundCampaignAnalyticsLink => {
    // only track the first clickthrough (updatedAt is set automatically)
    if (foundCampaignAnalyticsLink) {
      foundCampaignAnalyticsLink.clicked = true;

      // Attempt to get ip
      const ipAddress = req.headers['x -forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      foundCampaignAnalyticsLink.ipAddress = ipAddress;

      // Attempt ip geolocation using MaxMind db
      const geoLocation = geoip.lookup(ipAddress);
      if (geoLocation) {  // If the IP address was not found, the lookup returns null
        foundCampaignAnalyticsLink.country = geoLocation.country;
        foundCampaignAnalyticsLink.region = geoLocation.region;
        foundCampaignAnalyticsLink.city = geoLocation.city;
      }

      // Parse headers
      const headers = uaParser(req.headers['user-agent']);
      foundCampaignAnalyticsLink.browserName = headers.browser.name;
      foundCampaignAnalyticsLink.deviceVendor = headers.device.vendor;
      foundCampaignAnalyticsLink.deviceType = headers.device.type;
      foundCampaignAnalyticsLink.operatingSystem = headers.os.name;

      foundCampaignAnalyticsLink.save().then(result => {
        CampaignAnalytics.findById(foundCampaignAnalyticsLink.campaignanalyticId).then(foundCampaignAnalytics => {
          foundCampaignAnalytics.increment('clickthroughCount').then(result => {
            console.log("saved");
          });
        });
      });
    }
  })

  res.redirect(req.query.url);
}
