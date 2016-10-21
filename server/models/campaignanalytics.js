'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaignanalytics = sequelize.define('campaignanalytics', {
    complaintCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    permanentBounceCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    transientBounceCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    undeterminedBounceCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalSentCount: { type: DataTypes.INTEGER, defaultValue: 0 },
    trackLinksEnabled: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    freezeTableName: true,  // because CampaignAnalyticss is a silly name
    classMethods: {
      associate: function(models) {
        campaignanalytics.belongsTo(models.campaign);
        campaignanalytics.hasMany(models.campaignanalyticslink)
      }
    }
  });
  return campaignanalytics;
};
