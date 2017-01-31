const AWS = require('aws-sdk');
const async = require('async');

module.exports = (credentials, callback) => {
  AWS.config.update({accessKeyId: credentials.accessKey, secretAccessKey: credentials.secretKey, region: credentials.region});

  async.waterfall([
    async.apply(createSnsTopics, { sqs: { url: '', arn: '' }, sns: { bounce: { arn: '' }, complaint: { arn: '' } } }),
    createSqsQueue,
    subscribeSnsToSqs,
    subscribeSesToSns
  ], (err, queueUrl) => {
    if (err) {
      console.log(err);
      callback(err);
    } else {
      console.log(`SQS queue created successfully: ${queueUrl}`);
      callback(null, queueUrl);
    }
  });
}

function createSnsTopics (config = { sns: { bounce: { arn: '' }, complaint: { arn: '' } } }, callback) {
  const SNS_BOUNCE_NAME = 'mail-for-good-ses-bounce';
  const SNS_COMPLAINT_NAME = 'mail-for-good-ses-complaint';

  const create = (name, callback) => {
    // If this queue already exists, it just returns the ARN
    const sns = new AWS.SNS();
    console.log(`Creating SNS topic: ${name}`);

    sns.createTopic({
      Name: name
    }, (err, result) => {
      if (err) {
        callback(err);
      } else {
        callback(null, result.TopicArn);
      }
    });
  }

  async.parallel({
    bounce: async.apply(create, SNS_BOUNCE_NAME),
    complaint: async.apply(create, SNS_COMPLAINT_NAME)
  }, (err, result) => {
    if (err) {
      callback(err);
    } else {
      config.sns.bounce.arn = result.bounce;
      config.sns.complaint.arn = result.complaint;

      callback(null, config);
    }
  });
}

/*
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SQS.html#createQueue-property
 */
function createSqsQueue (config = { sqs: { url: '', arn: '' } }, callback) {
  console.log("Creating SQS queue");
  const SQS_NAME = 'mail-for-good-ses-feedback';
  const sqs = new AWS.SQS();

  // Configure the SQS permissions so that it can receive
  // messages from SNS. This is a bit fiddly because we have to
  // make sure that SQS only receives SNS messages from the bounce
  // and complaint topics we have set up, otherwise anyone would be able
  // to abuse the queue.
  // See https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
  const policy = {
    Version: "2012-10-17",
    Id: "mail-for-good-ses-feedback-queue-policy",
    Statement:
      {
        Sid: "mail-for-good-ses",
        Effect: "Allow",
        Principal: "*",
        Action: "SQS:*",
        // Hacky way of calculating the arn
        Resource: `arn:aws:sqs:${config.sns.bounce.arn.split(':')[3]}:${config.sns.bounce.arn.split(':')[4]}:${SQS_NAME}`,
        Condition: {
          ArnEquals: {
            "aws:SourceArn": [config.sns.bounce.arn, config.sns.complaint.arn]
          }
        }
      }
  }

  sqs.createQueue({
    QueueName: SQS_NAME,
    Attributes: {
      ReceiveMessageWaitTimeSeconds: '20',
      Policy: JSON.stringify(policy)
    }
  }, (err, result) => {
    if (err ) {
      callback(err);
    } else {
      config.sqs.url = result.QueueUrl;

      sqs.getQueueAttributes({
        QueueUrl: config.sqs.url,
        AttributeNames: ["QueueArn"]
      }, (err, result) => {
        if (err) {
          callback(err);
        } else {
          config.sqs.arn = result.Attributes.QueueArn;
          callback(null, config);
        }
      });
    }
  });
}

function subscribeSnsToSqs (config, callback) {
  console.log("Subscribing topics to queue");
  const sqs = new AWS.SQS();
  const sns = new AWS.SNS();

  const subscribe = (topic, callback) => {
    sns.subscribe({
      TopicArn: topic,
      Protocol: 'sqs',
      Endpoint: config.sqs.arn
    }, callback);
  }

  async.parallel({
    bounce: async.apply(subscribe, config.sns.bounce.arn),
    complaint: async.apply(subscribe, config.sns.complaint.arn)
  }, (err, result) => {
    console.log(err);
    console.log(result);
    callback(null, config);
  });
}

function subscribeSesToSns (config, callback) {
  const ses = new AWS.SES();

  ses.listIdentities({
    IdentityType: 'EmailAddress',
    MaxItems: 1000
  }, (err, result) => {
    if (err) {
      callback(err);
    } else {
      const identities = result.Identities;
      if (!identities.length) {
        callback(new Error('No SES identity has been configured'));
      } else if (identities.length > 1) {
        callback(new Error('More than one identity present')); // Need to decide what to do for ambiguous identity case
      } else {

        async.parallel({
          bounce: callback => ses.setIdentityNotificationTopic({
            Identity: identities[0],
            NotificationType: 'Bounce',
            SnsTopic: config.sns.bounce.arn
          }, callback),
          complaint: callback => ses.setIdentityNotificationTopic({
            Identity: identities[0],
            NotificationType: 'Complaint',
            SnsTopic: config.sns.complaint.arn
          }, callback)
        }, (err, result) => {
          if (!err) {
            callback(null, config.sqs.url);
          } else {
            callback(err);
          }
        });
      }
    }
  });
}
