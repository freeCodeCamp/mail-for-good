const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

const secret = require('../../config/secrets');

/*
    From repo: https://github.com/andris9/nodemailer-ses-transport

    ses - instantiated AWS SES object. If not provided then one is generated automatically using the other options
    accessKeyId - optional AWS access key. Not used if options.ses is set.
    secretAccessKey - optional AWS secret. Not used if options.ses is set.
    sessionToken - optional session token. Not used if options.ses is set.
    region - optional Specify the region to send the service request to. Defaults to us-east-1. Not used if options.ses is set.
    httpOptions - A set of options to pass to the low-level AWS HTTP request. See options in the AWS-SES docs. Not used if options.ses is set.
    rateLimit - optional Specify the amount of messages that can be sent in 1 second. For example if you want to send at most 5 messages in a second, set this value to 5. If you do not set it, rate limiting is not applied and messages are sent out immediately.
    maxConnections - optional Specify the maximum number of messages to be "in-flight" at any one point in time. Useful for preventing suffocation of an internet connection when sending lots of messages.

    ///////////
    // Tests //
    ///////////

    https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html
    success@simulator.amazonses.com (Successful email)
    bounce@simulator.amazonses.com (Soft bounce)
    ooto@simulator.amazonses.com (Out of office response from ISP)
    complaint@simulator.amazonses.com (Complaint from ISP)
    suppressionlist@simulator.amazonses.com (Hard bounce as target email is on Amazon's suppression list)

    // WARNING //

    When you send emails to the mailbox simulator, you will be limited by your maximum send rate. You will also be billed for your emails.
    However, emails to the mailbox simulator will not affect your email deliverability metrics for bounces and complaints or count against your sending quota.
*/

const amazonTestEmails = {
  success: 'success@simulator.amazonses.com',
  bounce: 'bounce@simulator.amazonses.com',
  ooto: 'ooto@simulator.amazonses.com',
  complaint: 'complaint@simulator.amazonses.com',
  suppressed: 'suppressionlist@simulator.amazonses.com'
};

module.exports = () => {

  const options = { // These options need to be configured
    accessKeyId: secret.email.amazon.accessKeyId,
    secretAccessKey: secret.email.amazon.secretAccessKey,
    region: 'us-west-2',
    rateLimit: 1
  };

  const transporter = nodemailer.createTransport(sesTransport(options));

  var mailOptions = {
    from: `<${secret.testEmail}>`,
    to: `${amazonTestEmails.success}`,
    subject: 'Hello',
    text: 'This is a test email from nonprofit-email-service...',
    //html: '<b>Implementation of HTML is TBA</b>'
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    console.log(`Message sent to ${secret.testEmail}!`);
  });
}
