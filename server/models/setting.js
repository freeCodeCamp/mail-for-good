'use strict';
const crypto = require('crypto')
const algorithm = 'aes-256-ctr';
const password = process.env.ENCRYPTION_PASSWORD;

if (!password) {
  throw new Error('AWS encryption password was empty. Set a password by providing the ENCRYPTION_PASSWORD environment variable in .env');
}

module.exports = function(sequelize, DataTypes) {
  var setting = sequelize.define('setting', {
    amazonSimpleEmailServiceAccessKey: { type: DataTypes.STRING, defaultValue: '' },
    amazonSimpleEmailServiceSecretKeyEncrypted: { type: DataTypes.STRING, defaultValue: '' },
    amazonSimpleEmailServiceSecretKey: {
      // This virtual datatype allows us to abstract away the encryption and decryption of the AWS keys.
      // Decryption and encryption are handled by the get and set functions below and act on the
      // amazonSimpleEmailServiceSecretKeyEncrypted column where the encrypted key is stored. Because of this,
      // there is actually no amazonSimpleEmailServiceSecretKey column.
      type: new DataTypes.VIRTUAL(DataTypes.STRING, ['amazonSimpleEmailServiceSecretKeyEncrypted']),
      set: function (val) {
        const cipher = crypto.createCipher(algorithm,password)
        let crypted = cipher.update(val,'utf8','hex')
        crypted += cipher.final('hex');
        this.setDataValue('amazonSimpleEmailServiceSecretKeyEncrypted', crypted);
      },
      get: function () {
        const decipher = crypto.createDecipher(algorithm,password);
        let dec = decipher.update(this.getDataValue('amazonSimpleEmailServiceSecretKeyEncrypted'),'hex','utf8');
        dec += decipher.final('utf8');
        return dec;
      }
    },
    amazonSimpleQueueServiceUrl: { type: DataTypes.STRING, defaultValue: '' },
    region: { type: DataTypes.STRING, defaultValue: '' },
    whiteLabelUrl: { type: DataTypes.STRING, defaultValue: '' },
    email: { type: DataTypes.STRING, defaultValue: '' }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        setting.belongsTo(models.user);
      }
    }
  });
  return setting;
};
