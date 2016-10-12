const queue = require('async/queue');
const AWS = require('aws-sdk');

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

NOTE: Use these particular functions in the future
ses.getSendStatistics(function(err, data) {
if (err) console.log(err, err.stack); // an error occurred
else     console.log(data);           // successful response
});

ses.getSendQuota(function(err, data) {
if (err) console.log(err, err.stack); // an error occurred
else     console.log(data);           // successful response
});

*/


module.exports = (generator, ListSubscriber, campaignInfo, accessKey, secretKey) => {

  const concurrency = 500; // No. of emails to process server side, limited to prevent overflow
  const limit = 1; // The number of emails to be pulled from each returnList call
  let rateLimit = 1; // The number of emails to send per second
  let totalListSubscribers = 0; // The total num of list subscribers to be processed
  let offset = limit - 1; // The offset when pulling emails from the db

  const ses = new AWS.SES({
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
    region: `eu-west-1` //TODO: Get this from the client
  });

  const q = queue((task, done) => {

    // Ref https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SES.html#sendEmail-property
    const params = {
      Source: campaignInfo.fromEmail, // From email
      Destination: { // To email
        ToAddresses: [task.email]
      },
      Message: {
        Body: { // Body (plaintext or html)
          Text: {
            Data: 'This is a test email from nonprofit-email-service!'
          }
        },
        Subject: { // Subject
          Data: 'Hello from nonprofit-email-service'
        }
      }
    };

    ses.sendEmail(params, (err, data) => {
      // NOTE: Data contains only data.messageId, which we need to get the result of the request in terms of success/bounce/complaint etc from Amazon later
      if (err) {
       throw err;
      }
      console.log(data);
      done(); // Accept new email from pool

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

  function pushByRateLimit() {
    setTimeout(() => {
      if (totalListSubscribers > offset) {
       returnList();
       pushByRateLimit();
     } else {
       generator.next();
     }
    }, (1000 / rateLimit));
  }

  ListSubscriber.count({
    where: {
      listId: campaignInfo.listId
    }
  }).then(total => {
    totalListSubscribers = total;
    // Start the process
    pushByRateLimit();
  }).catch(err => {
    throw err;
  });

};
