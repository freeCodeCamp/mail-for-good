'use strict';
module.exports = function(sequelize, DataTypes) {
  var acl = sequelize.define('acl', {
    userId: DataTypes.STRING,
    toUserId: DataTypes.STRING,
    toUserEmail: DataTypes.STRING,
    campaigns: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return acl;
};
