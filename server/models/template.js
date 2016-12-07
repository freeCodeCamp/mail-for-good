'use strict';
module.exports = function(sequelize, DataTypes) {
  var template = sequelize.define('template', {
    name: DataTypes.STRING,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    emailSubject: DataTypes.STRING,
    emailBody: DataTypes.TEXT,
    type: DataTypes.STRING,
    slug: DataTypes.STRING,
    trackingPixelEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    trackLinksEnabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    unsubscribeLinkEnabled: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        template.belongsTo(models.user);
      }
    }
  });
  return template;
};
