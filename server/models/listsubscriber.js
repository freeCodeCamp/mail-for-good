'use strict';
module.exports = function(sequelize, DataTypes) {
  var listsubscriber = sequelize.define('listsubscriber', {
    email: DataTypes.STRING,
    subscribed: { type: DataTypes.BOOLEAN, defaultValue: true },
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
