const db = require('../../../../../models');
const sendUpdateNotification = require('../../../../websockets/send-update-notification');

/**
 * @description Send an update notification letting the user know how many emails have been sent
 * @param {object} campaignInfo - Information about this campaign
 * @param {object} io - Configured Redis instance
 * @param {object} req - The express request
 * @return {function} a function to call to send the update notification.
 */

module.exports = (campaignInfo, io, req) => {
  const id = (Math.random() * 100000).toString();

  const notification = () => {
    db.campaignanalytics.findOne({
      where: { campaignId: campaignInfo.campaignId },
      attributes: ['totalSentCount']
    }).then(campaignAnalytics => {
      const notification = {
        message: `Sent ${campaignAnalytics.totalSentCount} emails`,
        id, // Unique identified for use on client side (in the reducer)
        icon: 'fa-envelope',
        iconColour: 'text-green'
      };

      sendUpdateNotification(io, req, notification);
    });
  };

  return notification;
};
