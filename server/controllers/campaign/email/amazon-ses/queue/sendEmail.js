const Promise = require('bluebird');

const CampaignSubscriber = require('../../../../../models').campaignsubscriber;
const CampaignAnalytics = require('../../../../../models').campaignanalytics;

/**
 * @description Add an email to the queue.
 * @param {object} email - configured email to send
 * @param {object} campaignInfo - Information about this campaign
 * @param {object} ses - Configured Amazon SES instance used to send this email
 * @return {function} A function to call to add an item to the queue. Check the usage of this below.
 */

module.exports = function(amazonEmail, campaignInfo, ses) {
  const { email, task } = amazonEmail;
  const promisifiedSes = Promise.promisify(ses.sendEmail, { context: ses });

  /**
   * @private
   * @description Update the database's analytics tracking for this email
   * @param {object} data - the response from SES
   * @param {object} task - the listsubcriber + campaignsubcriber info
   * @param {object} campaignInfo - Information about this campaign
   * @return {Promise} a promise that resolves when the tracking info has been saved
   */

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

  /**
   * @description Send an email via Amazon SES
   * @param {object} email - configured amazon email to send
   * @return {Promise} a promise that resolves when the tracking info has been saved
   */

  return promisifiedSes(email)
    .then(data => {
      return _updateAnalytics(data, task, campaignInfo);
    })
    .catch(err => {
      console.log(err);
      return;
    });
};
