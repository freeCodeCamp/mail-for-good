'use strict';
module.exports = function(sequelize, DataTypes) {
  var acl = sequelize.define('acl', {
    userId: DataTypes.STRING, // This is the userId who granted permissions
    fromUserEmail: DataTypes.STRING,
    toUserId: DataTypes.STRING,
    toUserEmail: DataTypes.STRING,
    campaigns: DataTypes.STRING,
    templates: DataTypes.STRING,
    lists: DataTypes.STRING
  }, {
    classMethods: {
      associate: function() {
        // associations can be defined here
      }
    }
  });
  return acl;
};
