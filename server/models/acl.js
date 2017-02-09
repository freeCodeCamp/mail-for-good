'use strict';
module.exports = function(sequelize, DataTypes) {
  var acl = sequelize.define('acl', {
    userId: DataTypes.STRING, // This is the userId who granted permissions
    fromUserEmail: DataTypes.STRING,
    toUserId: DataTypes.STRING,
    toUserEmail: DataTypes.STRING,
    campaigns: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } },
    templates: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } },
    lists: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } }
  }, {
    classMethods: {
      associate: function() {
        // associations can be defined here
      }
    },
    indexes: [
      {
        fields:['userId']
      },
      {
        fields:['toUserId']
      }
    ]
  });
  return acl;
};
