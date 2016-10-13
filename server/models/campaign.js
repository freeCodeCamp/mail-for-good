'use strict';
module.exports = function(sequelize, DataTypes) {
  var campaign = sequelize.define('campaign', {
    name: DataTypes.STRING,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    emailSubject: DataTypes.STRING,
    emailBody: DataTypes.STRING,
    slug: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        campaign.belongsTo(models.user);
        campaign.belongsTo(models.list);
      }
    }
  });
  return campaign;
};
