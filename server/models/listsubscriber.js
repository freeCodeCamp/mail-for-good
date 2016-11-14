'use strict';
module.exports = function(sequelize, DataTypes) {
  var listsubscriber = sequelize.define('listsubscriber', {
    email: DataTypes.STRING,
    subscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
    unsubscribeKey: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    mostRecentStatus: { type: DataTypes.STRING, defaultValue: 'unconfirmed' } // bounce:permanent, bounce:transient, complaint
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        listsubscriber.belongsTo(models.list);
        listsubscriber.hasMany(models.campaignanalyticslink);
        listsubscriber.hasMany(models.campaignanalyticsopen);
      }
    }
  });
  return listsubscriber;
};
