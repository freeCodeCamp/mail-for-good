'use strict';
module.exports = function(sequelize, DataTypes) {
  var list = sequelize.define('list', {
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        list.belongsTo(models.user);
      }
    }
  });
  return list;
};
