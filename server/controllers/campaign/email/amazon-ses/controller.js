const queue = require('async/queue');
const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

/*
Rejections due to a lack of verification look like:
 ---
{ message: 'Email address is not verified. The following identities failed the check in region US-WEST-2: andrew_walsh1@hotmail.co.uk',
code: 'MessageRejected',
time: 2016-10-10T21:55:44.210Z,
requestId: '4ae34b7c-8f34-11e6-8588-bb42bd063af8',
statusCode: 400,
retryable: false,
retryDelay: 82.08305956551291 }

https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html
success@simulator.amazonses.com (Successful email)
bounce@simulator.amazonses.com (Soft bounce)
ooto@simulator.amazonses.com (Out of office response from ISP)
complaint@simulator.amazonses.com (Complaint from ISP)
suppressionlist@simulator.amazonses.com (Hard bounce as target email is on Amazon's suppression list)

API endpoints
US East (N. Virginia)	us-east-1	email.us-east-1.amazonaws.com	email-smtp.us-east-1.amazonaws.com	Email sending
US West (Oregon)	us-west-2	email.us-west-2.amazonaws.com	email-smtp.us-west-2.amazonaws.com	Email sending
EU (Ireland)	eu-west-1	email.eu-west-1.amazonaws.com	email-smtp.eu-west-1.amazonaws.com	Email sending
US East (N. Virginia)	us-east-1	N/A	inbound-smtp.us-east-1.amazonaws.com	Email receiving
US West (Oregon)	us-west-2	N/A	inbound-smtp.us-west-2.amazonaws.com	Email receiving
EU (Ireland)	eu-west-1	N/A	inbound-smtp.eu-west-1.amazonaws.com	Email receiving

*/


module.exports = (generator, ListSubscriber, campaignInfo, accessKey, secretKey) => {

  const limit = 1; // The number of emails to pull from the db at once. Dte
  let concurrency = 1;
  let totalListSubscribers = 0; // R
  let offset = 0;

  const options = {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: 'eu-west-1',
    rateLimit: concurrency // Emails per second
  };
  const transporter = nodemailer.createTransport(sesTransport(options));

  const q = queue((task, done) => {
    const mailOptions = {
      from: `<${campaignInfo.fromEmail}>`,
      to: `${task.email}`,
      subject: 'Hello from nonprofit-email-service',
      text: 'This is a test email from nonprofit-email-service!'
      //html: '<b>Implementation of HTML is TBA</b>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        throw err;
      }
      if (totalListSubscribers !== offset) {
        returnList(); // Get a new listSubscriber
        done(); // Accept new email from pool
      }
    });

  }, concurrency);

  q.drain(() => {
    console.log('all done!');
  });

  const returnList = () => {
    ListSubscriber.findAll({
      where: {
        listId: campaignInfo.listId
      },
      limit,
      offset,
      raw: true
    }).then(listRaw => {
      offset += limit;
      q.push(listRaw, err => {
        if (err) throw err;
      });
    }).catch(err => {
      throw err;
    });
  }

  ListSubscriber.count({
    where: {
      listId: campaignInfo.listId
    }
  }).then(total => {
    totalListSubscribers = total;
    // Start the process
    returnList();
  });

};
