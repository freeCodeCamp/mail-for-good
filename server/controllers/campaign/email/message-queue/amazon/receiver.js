const Queue = require('bull');
const Receiver = Queue('amazon', process.env.REDIS_PORT || 6379, process.env.REDIS_HOST || '127.0.0.1');
const Promise = require('bluebird');
const redis = require("redis");

const CampaignSubscriber = require('../../../../../models').campaignsubscriber;
const CampaignAnalytics = require('../../../../../models').campaignanalytics;

/*
  This file receives emails from the Redis queue and sends them via Amazon SES. It limits the number
  it will send to the rateLimit as determined by Amazon.
*/

module.exports = function(ses, rateLimit, campaignInfo) {
  // const EMAILS_PER_SECOND = rateLimit;
  // const ONE_SECOND = 1000;
  const CONCURRENCY = rateLimit; // No. of jobs to process in parallel on a single worker

  Receiver.process(CONCURRENCY, job => {
    // Call the _sendEmail function in the parent closure
    const { email, task } = job.data; // See Amazon.js - where { email } is a formatted SES email & { info } contains the id

    // Promisify (turn into a promise) the send email callback func - http://bluebirdjs.com/docs/api/promise.promisify.html
    const promisifiedSes = Promise.promisify(ses.sendEmail, { context: ses });
    return promisifiedSes(email)
      .then(data => {
        return _updateAnalytics(data, task, campaignInfo);
      })
      .catch(err => {
        console.log(err);
        return;
      });
  });

  Receiver.on('completed', function(){
    // Clean all completed jobs (remove from redis)
    Receiver.clean(1000, 'completed');
    Receiver.clean(1000, 'failed');
  });

  Receiver.on('error', function(error) {
    console.log(error); // eslint-disable-line
  });

  const redisSettings = { host: process.env.REDIS_HOST || '127.0.0.1' };
  const client = redis.createClient(redisSettings);

  function _updateAnalytics(data, task, campaignInfo) {
    const p1 = CampaignSubscriber.update(
      {
        messageId: data.MessageId,
        sent: true
      },
      {
        where: {
          id: task['campaignsubscribers.id'],
          listsubscriberId: task.id,
          campaignId: campaignInfo.campaignId
        },
        limit: 1
      }
    );

    const p2 = CampaignAnalytics.findById(campaignInfo.campaignAnalyticsId)
      .then(foundCampaignAnalytics => {
        return foundCampaignAnalytics.increment('totalSentCount');
      });

    return Promise.all([p1, p2]);
  }

  function _quit() {
    const THREE_SECONDS = 3000;
    setTimeout(() => {
      client.quit(); // Close Redis connection
    }, THREE_SECONDS);
  }

  return {
    close: function close() {
      // Close connection after 3 seconds
      Receiver.close(); // Close bull connection
      _quit();
    },
    count: function count() {
      return Receiver.count();
    }
  };
};
