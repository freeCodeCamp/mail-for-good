'use strict';
module.exports = function(sequelize, DataTypes) {
  var subscriber = sequelize.define('subscriber', {
    email: DataTypes.STRING,
    customdata: DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      indexes: [
        {
          fields:['email']
        }
      ]
    }
  });
  return subscriber;
};
