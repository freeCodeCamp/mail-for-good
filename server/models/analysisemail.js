'use strict';
module.exports = function(sequelize, DataTypes) {
  var analysisemail = sequelize.define('analysisEmail', {
    sesMessageId: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        analysisemail.belongsTo(models.analysis);
      }
    }
  });
  return analysisemail;
};
