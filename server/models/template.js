'use strict';
module.exports = function(sequelize, DataTypes) {
  var template = sequelize.define('template', {
    name: DataTypes.STRING,
    fromName: DataTypes.STRING,
    fromEmail: DataTypes.STRING,
    emailSubject: DataTypes.STRING,
    emailBody: DataTypes.TEXT,
    type: DataTypes.STRING
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
