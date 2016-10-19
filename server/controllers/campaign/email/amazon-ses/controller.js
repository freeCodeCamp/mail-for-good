const queue = require('async/queue');
const AWS = require('aws-sdk');
const backoff = require('backoff');

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

Successful response has form:
{ ResponseMetadata: { RequestId: 'e8a3d6b4-94fd-11z6-afac-757cax279ap5' },
  MessageId: '01020157a1261241-90a5e1cd-3a5z-4sb7-1r41-957a4cae8e58-000000' }
Throttling error:
{ Throttling: Maximum sending rate exceeded.
    at ...
  message: 'Maximum sending rate exceeded.',
  code: 'Throttling',
  time: 2016-10-18T07:50:11.286Z,
  requestId: '7f2d1781-9507-11e6-8885-675506266ba7',
  statusCode: 400,
  retryable: true }

*/

module.exports = (generator, ListSubscriber, campaignInfo, accessKey, secretKey, quotas, totalListSubscribers, region) => {

  // TODO: Remaining issue where rateLimit is determined by response time of DB. Needs fix.

  const limit = 1; // The number of emails to be pulled from each returnList call
  let rateLimit = quotas.MaxSendRate; // The number of emails to send per second
  let offset = limit - 1; // The offset when pulling emails from the db
  let pushByRateLimitInterval = 0;

  const backoffExpo = backoff.exponential({ // Exp backoff for throttling errs - see https://github.com/MathieuTurcotte/node-backoff
    initialDelay: 3000,
    maxDelay: 120000
  });

  const ses = new AWS.SES({ accessKeyId: accessKey, secretAccessKey: secretKey, region });

  ///////////
  // Queue //
  ///////////

  const q = queue((task, done) => {
    const emailFormat = AmazonEmail(task, campaignInfo);

    ses.sendEmail(emailFormat, (err, data) => {
      // NOTE: Data contains only data.messageId, which we need to get the result of the request in terms of success/bounce/complaint etc from Amazon later
      if (err) {
        handleError(err, done, task);
      } else {
        done(); // Accept new email from pool
      }
    });

  }, rateLimit);

  const pushToQueue = list => {
    q.push(list, err => {
      if (err)
        throw err;
      }
    );
  };

  ///////////
  ///////////

  ///////////
  // Error //
  ///////////

  function handleError(err, done, task) {
    switch(err.code) {
      case 'Throttling':
        handleThrottlingError(done, task);
    }
  }

  function handleThrottlingError(done, task) {
    // Too many responses send per second. Handle error by reducing sending rate.

    backoffExpo.backoff();
    pushToQueue(task);

  }

  backoffExpo.on('backoff', () => {
    // Stop interval, pause queue & reduce rateLimit
    clearInterval(pushByRateLimit);
    q.pause();
    rateLimit = Math.floor(rateLimit - (rateLimit / 10)) > 0 ? Math.floor(rateLimit - (rateLimit / 10)) > 0 : 1;
  });

  backoffExpo.on('ready', () => {
    q.resume();
    // Wait for existing buffer to clear then start again
    setTimeout(pushByRateLimit, 2000);
  });

  ///////////
  ///////////

  ///////////
  // Calls //
  ///////////

  const returnList = () => {
    ListSubscriber.findAll({
      where: {
        listId: campaignInfo.listId
      },
      limit,
      offset,
      raw: true
    }).then(list => {
      pushToQueue(list);
    }).catch(err => {
      throw err;
    });
  };

  function pushByRateLimit() {
    pushByRateLimitInterval = setInterval(() => {
      if (totalListSubscribers > offset) {
        returnList();
        offset += limit;
      } else {
        clearInterval(pushByRateLimit);
        console.timeEnd('sending');
        generator.next(null);
      }
    }, (1000 / rateLimit));
  }

  (function startSending() {
    console.time('sending');
    pushByRateLimit();
  })();

  ///////////
  ///////////

};
