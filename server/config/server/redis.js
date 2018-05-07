const redis = require('redis');

module.exports = () => {
  const redisSettings = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
  };
  const redisUrl = process.env.REDIS_URL;

  const client = createRedisClient(redisSettings,redisUrl); 
  const subscriber = createRedisClient(redisSettings,redisUrl);  // Need to create separate connections
  const publisher = createRedisClient(redisSettings,redisUrl);   // for pub-sub

  client.on('error', err => console.log('Error: Are you running redis? - ', err));

  return {
    client,
    subscriber,
    publisher,
  };
};


function createRedisClient(settings, url) {
  let client;

  if(url){
    client = redis.createClient(url);
  }else{
    client = redis.createClient(settings);
  }

  return client;
}
