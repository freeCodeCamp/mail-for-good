const Queue = require('bull');
const Receiver = Queue('amazon');
const Limiter = require('rolling-rate-limiter');
const Promise = require('bluebird');
const redis = require("redis");

const CampaignSubscriber = require('../../../../../models').campaignsubscriber;
const CampaignAnalytics = require('../../../../../models').campaignanalytics;

/*
  This file receives emails from the Redis queue and sends them via Amazon SES. It limits the number
  it will send to the rateLimit as determined by Amazon.
*/

module.exports = function(ses, rateLimit, campaignInfo) {
  const EMAILS_PER_SECOND = rateLimit * 1000;
  const ONE_SECOND = 1000;
  const LIMITER_NAMESPACE = 'email'; // Variable used by Limiter to determine if an item should be limited
  const CONCURRENCY = rateLimit; // No. of jobs to process in parallel on a single worker

  Receiver.process(CONCURRENCY, (job) => {
    // Call the _sendEmail function in the parent closure
    const emailFormat = job.data;
    return ses.sendEmail(emailFormat, (err, data) => {
      if (err) {
        console.log(err); // eslint-disable-line
      }

      const p1 = CampaignSubscriber.update(
        {
          messageId: data.MessageId,
          sent: true
        },
        {
          where: {
            listsubscriberId: emailFormat.id,
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
      // _updateAnalytics(data, emailFormat.id);
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

  const client = redis.createClient();

  const limiter = Promise.promisify(Limiter({
    interval: ONE_SECOND,
    maxInInterval: EMAILS_PER_SECOND,
    redis: client,
    namespace: `amazon-${Math.random().toString(36)}`
  }));

  function _updateAnalytics(data, listsubscriberId) {
    CampaignSubscriber.update(
      {
        messageId: data.MessageId,
        sent: true
      },
      {
        where: {
          listsubscriberId,
          campaignId: campaignInfo.campaignId
        },
        limit: 1
      }
    );

    CampaignAnalytics.findById(campaignInfo.campaignAnalyticsId)
      .then(foundCampaignAnalytics => {
        foundCampaignAnalytics.increment('totalSentCount');
      });
  }

  function _sendEmail(emailFormat) {
    limiter(LIMITER_NAMESPACE, function(thereIsTimeLeft) {
      if (thereIsTimeLeft) {
        // limit was exceeded, action should not be allowed
        //// Retry in a second.
        console.log('Jobs are being sent too fast!'); // eslint-disable-line
        Promise.delay(ONE_SECOND).then(() => _sendEmail(emailFormat));
      } else {
        // limit was not exceeded, action should be allowed
        ses.sendEmail(emailFormat, (err, data) => {
          if (err) {
            console.log(err); // eslint-disable-line
          }
          _updateAnalytics(data, emailFormat.id);
        });
      }
    });
  }

  return {
    close: function close() {
      // Close connection after 3 seconds
      Receiver.close(); // Close bull connection
      const THREE_SECONDS = 3000;
      setTimeout(() => {
        client.quit(); // Close Redis connection
      }, THREE_SECONDS);
    },
    count: function count() {
      return Receiver.count();
    }
  };
};
