'use strict';
module.exports = function(sequelize, DataTypes) {
  var offerPermission = sequelize.define('offerPermission', {
    toUserId: DataTypes.STRING,
    fromUserEmail: DataTypes.STRING,
    toUserEmail: DataTypes.STRING,
    campaigns: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } },
    templates: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } },
    lists: { type: DataTypes.STRING, validate: { isIn: [['None', 'Read', 'Write']] } }
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
