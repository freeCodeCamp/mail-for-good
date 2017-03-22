const Bottleneck = require("bottleneck");
const sendEmail = require('./sendEmail');

/**
 * @description Configure queue.
 * @param {number} rateLimit - the number of emails that can be sent to SES per second
 * @param {object} ses - Configured Amazon SES SDK instance
 * @return {function} A function to call to add an item to the queue.
 */

module.exports = (rateLimit, ses) => {
  // https://github.com/SGrondin/bottleneck#constructor
  const RATE_LIMIT = 1000 / (rateLimit * 10);
  const limiter = new Bottleneck(0, RATE_LIMIT);

  /**
   * @description Add an email to the queue.
   * @param {object} amazonEmail - configured email to send
   * @param {object} campaignInfo - Information about this campaign
   * @return {Promise} Scheduled promise that resolves when we can add a new item to the queue.
   */

   const scheduleEmailSend = (amazonEmail, campaignInfo) => {
     limiter.schedule(sendEmail, amazonEmail, campaignInfo, ses);
     return;
   };
   return scheduleEmailSend;
};
