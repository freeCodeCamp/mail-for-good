'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    googleId: DataTypes.STRING,
    picture: DataTypes.STRING,
    token: DataTypes.STRING,
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    sentEmailsCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user;
};
