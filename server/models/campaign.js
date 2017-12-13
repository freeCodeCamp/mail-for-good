'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaign = sequelize.define('campaign', {
    name: DataTypes.STRING,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    emailSubject: DataTypes.STRING,
    emailBody: DataTypes.TEXT,
    type: DataTypes.STRING,
    slug: DataTypes.STRING,
    trackingPixelEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    trackLinksEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    unsubscribeLinkEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: { type: DataTypes.STRING, defaultValue: 'creating' },
    totalCampaignSubscribers: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        campaign.belongsTo(models.user);
        campaign.belongsTo(models.list);
        campaign.hasMany(models.campaignsubscriber);
        campaign.hasOne(models.campaignanalytics);
      }
    }
  });
  return campaign;
};
