const queue = require('async/queue');
const nodemailer = require('nodemailer');
const sesTransport = require('nodemailer-ses-transport');

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
        throw err;
      });
    }).catch(err => {
      throw err;
    });
  }

  const q = queue((task, done) => {
    console.log(task);
    const mailOptions = {
      from: `<${campaignInfo.fromEmail}>`,
      to: `${task.email}`,
      subject: 'Hello from nonprofit-email-service',
      text: 'This is a test email from nonprofit-email-service!'
      //html: '<b>Implementation of HTML is TBA</b>'
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return console.log(err);
      }
      console.log(`Message sent to ${secret.testEmail}!`);
      if (totalListSubscribers !== offset) {
        returnList(); // Get a new listSubscriber
      }
      done(); // Accept new email from pool
    });

  }, concurrency);

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
