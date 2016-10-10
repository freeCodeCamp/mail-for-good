const db = require('../../../models');

module.exports = (generator, accessKey, serviceKey) => {
  // NOTE: This file streams data from the db to the relay server
  const options = {
    accessKeyId: accessKey,
    secretAccessKey: serviceKey,
    region: 'us-west-2',
    rateLimit: 1 // Emails per second
  };

};
