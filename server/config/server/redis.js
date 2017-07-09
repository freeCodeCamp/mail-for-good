const redis = require('redis');

module.exports = () => {
  const redisSettings = { host: process.env.REDIS_HOST || '127.0.0.1' };
  const client = redis.createClient(redisSettings);
  const subscriber = redis.createClient(redisSettings);  // Need to create separate connections
  const publisher = redis.createClient(redisSettings);   // for pub-sub

  client.on('error', err => console.log('Error: Are you running redis? - ', err));

  return {
    client,
    subscriber,
    publisher,
  };
};
