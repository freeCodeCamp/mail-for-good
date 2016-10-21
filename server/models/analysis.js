'use strict';
module.exports = function(sequelize, DataTypes) {
  var analysis = sequelize.define('analysis', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return analysis;
};