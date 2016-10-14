const queue = require('async/queue');
const AWS = require('aws-sdk');

const AmazonEmail = require('./amazon');

/*

https://docs.aws.amazon.com/ses/latest/DeveloperGuide/mailbox-simulator.html
success@simulator.amazonses.com (Successful email)
bounce@simulator.amazonses.com (Soft bounce)
ooto@simulator.amazonses.com (Out of office response from ISP)
complaint@simulator.amazonses.com (Complaint from ISP)
suppressionlist@simulator.amazonses.com (Hard bounce as target email is on Amazon's suppression list)

API endpoints
US East (N. Virginia)	us-east-1
US West (Oregon)	us-west-2
EU (Ireland)	eu-west-1

*/

module.exports = (generator, ListSubscriber, campaignInfo, accessKey, secretKey, quotas, totalListSubscribers, region) => {

  // TODO: Remaining issue where rateLimit is determined by response time of DB. Needs fix.

  const limit = 1; // The number of emails to be pulled from each returnList call
  let rateLimit = quotas.MaxSendRate; // The number of emails to send per second
  let offset = limit - 1; // The offset when pulling emails from the db

  const ses = new AWS.SES({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: region
  });

  const q = queue((task, done) => {

    const emailFormat = AmazonEmail(task, campaignInfo);

    ses.sendEmail(emailFormat, (err, data) => {
      // NOTE: Data contains only data.messageId, which we need to get the result of the request in terms of success/bounce/complaint etc from Amazon later
      if (err) {
       throw err;
      }
      done(); // Accept new email from pool
    });

  }, rateLimit);

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

  (function pushByRateLimit() {
    setTimeout(() => {
      if (totalListSubscribers > offset) {
       returnList();
       pushByRateLimit();
     } else {
       generator.next(null);
     }
    }, (1000 / rateLimit));
  })();

};
