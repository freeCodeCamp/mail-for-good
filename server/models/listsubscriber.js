'use strict';
module.exports = function(sequelize, DataTypes) {
  var listsubscriber = sequelize.define('listsubscriber', {
    email: DataTypes.STRING,
    subscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
    unsubscribeKey: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        listsubscriber.belongsTo(models.list);
      }
    }
  });
  return listsubscriber;
};
