'use strict';
module.exports = function(sequelize, DataTypes) {
  var setting = sequelize.define('setting', {
    amazonSimpleEmailServiceAccessKey: DataTypes.STRING,
    amazonSimpleEmailServiceSecretKey: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return setting;
};