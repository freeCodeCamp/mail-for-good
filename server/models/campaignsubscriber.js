'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaignsubscriber = sequelize.define('campaignsubscriber', {
    email: DataTypes.STRING,
    messageId: DataTypes.STRING,
    status: DataTypes.STRING,
    bounceType: DataTypes.STRING,
    bounceSubType: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        campaignsubscriber.belongsTo(models.campaign);
      }
    }
  });
  return campaignsubscriber;
};
