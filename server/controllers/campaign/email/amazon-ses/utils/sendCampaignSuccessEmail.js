const AmazonEmail = require('../lib/amazon');

/**
 * @description Sends an email to the owner of the campaign informing them of the success of the campaign.
 * @param {object} campaignInfo - Information about this campaign
 * @param {Date} startTime - The Date that this campaign began sending
 * @param {object} ses - Configured Amazon SES SDK instance
 */


module.exports = (campaignInfo, startTime, ses) => {
  const data = {
    durationMs: new Date() - startTime,
    campaignName: campaignInfo.name,
    fromEmail: campaignInfo.fromEmail
  };

  const fromName = `Mail for Good`;
  const emailSubject = `MfG: campaign delivered`;
  const emailBody = `Campaign: "${data.campaignName}" has been successfully delivered.

Duration: ${(data.durationMs/1000/60).toFixed(2)} minutes`;

  ses.sendEmail(AmazonEmail(
    { email: data.fromEmail },
    { fromEmail: data.fromEmail, fromName, emailBody, emailSubject, type: 'Plaintext' }
  ).email, (data, err) => {
    console.log("Sent campaign delivery success email")
    console.log(err);
  });
};
