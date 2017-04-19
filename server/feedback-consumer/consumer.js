require('dotenv').config();
const debug = require('debug')('server:feedback-consumer:index');
const redis = require('redis');
const async = require('async');

const feedbackConsumer = require('./feedback-consumer');
const Campaign = require('../models').campaign;


feedbackConsumer.start();

console.log("Feedback consumer started: watching for feedback messages (bounces, complaints, etc) from SQS");

// Restart the feedback consumers to apply new credentials when
// new settings are received
const subscriber = redis.createClient({ host: process.env.REDIS_HOST || '127.0.0.1' });
subscriber.on('message', (channel, event) => {
  if (event == 'changed') {
    debug('Got a change-settings event, so restarting consumers to apply new credentials');
    feedbackConsumer.restart();
  }
});
subscriber.subscribe('change-settings');

const pollingRateMs = 10000;        
async.forever(next => {       
    setTimeout(next, pollingRateMs);     
});
