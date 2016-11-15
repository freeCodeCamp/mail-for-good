'use strict';
module.exports = function(sequelize, DataTypes) {
  var list = sequelize.define('list', {
    name: DataTypes.STRING,
    subscribeKey: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 }
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
