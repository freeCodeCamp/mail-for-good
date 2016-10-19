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
  let isBackingOff = false;
  let isRunning = false;

  let successCount = 0;

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
      console.log(err, data);
      if (err) {
        handleError(err, done, task);
      } else {

        /*if (q.length >= rateLimit) { // Prevents excessign congestion
          clearInterval(pushByRateLimitInterval);
          isRunning = false;
        } else if (!isRunning) {
          pushByRateLimit();
        }*/

        successCount++;
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
    if (!isBackingOff) {
      backoffExpo.backoff();
    }
    pushToQueue(task);
    done();
  }

  backoffExpo.on('backoff', () => {
    // Stop interval, pause queue & reduce rateLimit
    isBackingOff = true;
    clearInterval(pushByRateLimitInterval);
    isRunning = false;

    q.pause();
    rateLimit = Math.floor(rateLimit - (rateLimit / 10)) > 0 ? Math.floor(rateLimit - (rateLimit / 10)) : 1;
  });

  backoffExpo.on('ready', () => {
    q.resume();
    setTimeout(() => { // Wait for 2 seconds for the queue buffer to clear, then resume
      pushByRateLimit();
      isBackingOff = false;
    }, 2000);
  });

  backoffExpo.on('fail', () => {
    // Shouldn't happen but does need to be handled
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
    isRunning = true;
    pushByRateLimitInterval = setInterval(() => {
      if (totalListSubscribers > offset) {
        returnList();
        offset += limit;
      } else {
        console.timeEnd('sending');
        console.log(successCount);
        generator.next(null);
        clearInterval(pushByRateLimitInterval);
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
