'use strict';
module.exports = function(sequelize, DataTypes) {
  var setting = sequelize.define('setting', {
    amazonSimpleEmailServiceAccessKey: { type: DataTypes.STRING, defaultValue: '' },
    amazonSimpleEmailServiceSecretKey: { type: DataTypes.STRING, defaultValue: '' },
    region: { type: DataTypes.STRING, defaultValue: '' }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        setting.belongsTo(models.user);
      }
    }
  });
  return setting;
};
