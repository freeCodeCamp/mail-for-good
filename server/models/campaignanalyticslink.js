'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaignanalyticslink = sequelize.define('campaignanalyticslink', {
    userData: DataTypes.TEXT,
    ipAddress: DataTypes.STRING,
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
