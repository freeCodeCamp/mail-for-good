'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaignanalyticslink = sequelize.define('campaignanalyticslink', {
    country: DataTypes.STRING,  // 2 letter ISO-3166-1 country code
    region: DataTypes.STRING,   // 2 char region code: US=ISO-3166-2, other=FIPS 10-4
    city: DataTypes.STRING,     // Full city name
    ipAddress: DataTypes.STRING,
    operatingSystem: DataTypes.STRING,
    deviceType: DataTypes.STRING,
    deviceVendor: DataTypes.STRING,
    browserName: DataTypes.STRING,
    clicked: { type: DataTypes.BOOLEAN, defaultValue: false },
    trackingId: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
  }, {
    classMethods: {
      associate: function(models) {
        campaignanalyticslink.belongsTo(models.campaignanalytics);
        campaignanalyticslink.belongsTo(models.listsubscriber);
        // might want to assoc with user too
      }
    }
  });
  return campaignanalyticslink;
};
