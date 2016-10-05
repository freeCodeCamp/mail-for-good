'use strict';
module.exports = function(sequelize, DataTypes) {
  var listsubscriber = sequelize.define('listsubscriber', {
    email: DataTypes.STRING
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
