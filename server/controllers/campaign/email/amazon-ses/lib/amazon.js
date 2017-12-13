/**
 * @description Create an Amazon email based on the SES spec
 * @param {object} task - The email to create
 * @param {object} campaignInfo - Information about this campaign
 * @return {object} Formatted email object
 */


module.exports = (task, campaignInfo) => {

  // Ref https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
  const email = {
    Source: `"${campaignInfo.fromName}" <${campaignInfo.fromEmail}>`, // From email
    Destination: { // To email
      ToAddresses: [`<${task.email}>`] // Set name as follows https://docs.aws.amazon.com/ses/latest/DeveloperGuide/email-format.html
    },
    Message: {
      Body: {},
      Subject: { // Subject
        Data: campaignInfo.emailSubject
      }
    }
  };

  if (campaignInfo.type === 'Plaintext') { // Send as plaintext if plaintext, else send as HTML (no other format concerns us)
    Object.assign(email.Message.Body, { Text: { Data: campaignInfo.emailBody } });
  } else {
    Object.assign(email.Message.Body, { Html: { Data: campaignInfo.emailBody } });
  }

  return { email, task };
};
