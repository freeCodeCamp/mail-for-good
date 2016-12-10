'use strict';
module.exports = function(sequelize, DataTypes) {
  var offerPermission = sequelize.define('offerPermission', {
    fromEmail: DataTypes.STRING,
    campaigns: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        offerPermission.belongsTo(models.user);
      }
    }
  });
  return offerPermission;
};
