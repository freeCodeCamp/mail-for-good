const Promise = require('bluebird');

const CampaignSubscriber = require('../../../../models').campaignsubscriber;
const CampaignAnalytics = require('../../../../models').campaignanalytics;

/*
  This file receives emails from the Redis queue and sends them via Amazon SES. It limits the number
  it will send to the rateLimit as determined by Amazon.
*/

module.exports = function(Queue, ses, rateLimit, campaignInfo) {
  // const EMAILS_PER_SECOND = rateLimit;
  // const ONE_SECOND = 1000;
  const CONCURRENCY = rateLimit;

  Queue.process(CONCURRENCY, job => {
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

  Queue.on('completed', function(){
    // Clean all completed jobs (remove from redis)
    Queue.clean(1000, 'completed');
    Queue.clean(1000, 'failed');
  });

  Queue.on('error', function(error) {
    console.log(error); // eslint-disable-line
  });

  function _updateAnalytics(data, task, campaignInfo) {
    const p1 = CampaignSubscriber.update(
      {
        messageId: data.MessageId,
        sent: true
      },
      {
        where: {
          id: task['campaignsubscribers'][0].id,
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

  return {
    count: function count() {
      return Queue.count();
    }
  };
};
