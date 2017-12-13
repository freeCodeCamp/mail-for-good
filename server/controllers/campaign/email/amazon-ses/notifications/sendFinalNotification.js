const sendSingleNotification = require('../../../../websockets/send-single-notification');

/**
 * @description Send a final notification to the user informing them of the campaign's success
 * @param {string} outcome - The outcome of the email send
 * @param {object} campaignInfo - Information about this campaign
 * @param {object} io - Configured Redis instance
 * @param {object} req - The express request
 */

module.exports = (outcome, campaignInfo, io, req) => {
  if (outcome == 'success') {
    const notification = {
      message: `Campaign "${campaignInfo.name}" has been sent`,
      icon: 'fa-envelope',
      iconColour: 'text-green',
    };

    sendSingleNotification(io, req, notification);
  }
};
