'use strict';
module.exports = function(sequelize, DataTypes) {
  var subscriber = sequelize.define('subscriber', {
    email: DataTypes.STRING,
    customdata: DataTypes.ARRAY(DataTypes.STRING)
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
