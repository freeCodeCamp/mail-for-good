module.exports = (task, campaignInfo) => {

  // Ref https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
  return {
    Source: campaignInfo.fromEmail, // From email
    Destination: { // To email
      ToAddresses: [`"${campaignInfo.fromName}" <${task.email}>`] // Set name as follows https://docs.aws.amazon.com/ses/latest/DeveloperGuide/email-format.html
    },
    Message: {
      Body: { // Body (plaintext or html)
        Html: {
          Data: campaignInfo.emailBody
        }
      },
      Subject: { // Subject
        Data: campaignInfo.emailSubject
      }
    }
  };

}
