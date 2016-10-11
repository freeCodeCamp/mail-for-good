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

*/

module.exports = (generator, ListSubscriber, campaignInfo, accessKey, serviceKey) => {
  // NOTE: This file streams data from the db to the relay server
  const options = {
    accessKeyId: accessKey,
    secretAccessKey: serviceKey,
    region: 'us-west-2',
    rateLimit: 1 // Emails per second
  };
  const transporter = nodemailer.createTransport(sesTransport(options));
  const concurrency = 1;
  const limit = 1;
  let totalListSubscribers = 0; // Updated later
  let offset = 0;

  console.log(campaignInfo)

  const q = queue((task, done) => {
    console.log(task);
    const mailOptions = {
      from: `<${campaignInfo.fromEmail}>`,
      to: 'success@simulator.amazonses.com' || `${task.email}`,
      subject: 'Hello from nonprofit-email-service',
      text: 'This is a test email from nonprofit-email-service!'
      //html: '<b>Implementation of HTML is TBA</b>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Message sent to ${task.email}!`);
      if (totalListSubscribers !== offset) {
        console.log(totalListSubscribers);
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
      console.log(listRaw);
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
    console.log(total, totalListSubscribers);
    // Start the process
    returnList();
  });

};
