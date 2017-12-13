const debug = require('debug')('server:feedback-consumer:consumer');
const AWS = require('aws-sdk');
const Consumer = require('sqs-consumer');
const {
  sequelize,
  setting: Settings,
  campaignsubscriber: CampaignSubscriber,
  campaignanalytics: CampaignAnalytics,
  listsubscriber: ListSubscriber
} = require('./../models/index');

module.exports = {
  start,
  stop,
  restart
}

var consumers = [];

function start() {
  if (!consumers.length) {
    debug('Starting feedback consumers');
    setupConsumers();
  } else {
    debug('Consumers already started, ignoring start call');
  }
}

function stop() {
  debug('Stopping %d consumers', consumers.length);
  consumers.forEach(consumer => {
    consumer.stop();
  });
  consumers = [];
}

function restart() {
  stop();
  start();
}

let lock = false;
function setupConsumers() {
  consumers = [];

  // Hacky way of stopping calls during the Settings.findAll query
  // to prevent duplicate consumers from being produced.
  if (lock) {
    return;
  }

  lock = true;
  Settings.findAll({
  }).then(settings => {
    debug('Found %d settings', settings.length);
    settings.forEach(setting => {
      debug('Initialising a consumer using AWS access key: %s with the queue URL:  %s', setting.amazonSimpleEmailServiceAccessKey, setting.amazonSimpleQueueServiceUrl);
      try {
        consumers.push(createConsumer(setting.region, setting.amazonSimpleEmailServiceAccessKey, setting.amazonSimpleEmailServiceSecretKey, setting.amazonSimpleQueueServiceUrl));
      } catch (e) {
        debug('User with setting id %d has invalid settings, skipping consumer creation. Error: %o', setting.id, e);
      }
    });

    debug('Starting %d consumers', consumers.length);
    consumers.forEach(consumer => {
      consumer.start();
      consumer.on('error', err => {
        debug('Error event: %s', err.message);
      });
    });
    lock = false;
  }).catch(err => {
    throw err;
  });
}

function createConsumer(region, accessKeyId, secretAccessKey, queueUrl) {
  // Create a consumer that processes email feedback notifications from an SQS queue
  return Consumer.create({
    queueUrl,
    batchSize: 10,
    handleMessage: receiveMessageCallback,
    sqs: new AWS.SQS({ accessKeyId, secretAccessKey, region })
  });
}

function receiveMessageCallback(message, done) {
  // Perform overly complicated parsing of an SES feedback notification/message
  // and save the results to the database
  debug('Processing a feedback notification: %O', message);

  // Extract the SES email feedback notification
  // See example data structure: https://docs.aws.amazon.com/ses/latest/DeveloperGuide/notification-examples.html
  const email = JSON.parse(JSON.parse(message.Body).Message);

  // Check that the notification is valid
  if (email && email.notificationType && email.mail && email.mail.messageId) {

    // Construct the fields to update (status and bounceType)
    const notificationType = email.notificationType
    let bounceType = '';
    let bounceSubType = '';
    if (notificationType === 'Bounce' && email.bounce) {
      bounceType = email.bounce.bounceType;
      bounceSubType = email.bounce.bounceSubType;
    }

    // Attempt to update the CampaignSubscriber (sent email) record with the
    // feedback data we've just extracted above.
    CampaignSubscriber.update (
      { status: notificationType, bounceType, bounceSubType },
      {
        where: {
          messageId: email.mail.messageId,
          email: email.mail.destination[0].slice(1, -1)
        },
        returning: true  // Returns
      }
    ).then(result => {
      if (result[0]) {
        const updatedCampaignSubscriber = result[1][0];

        // Now we increment the count of bounces/complaints appropriately
        // This allows us to quickly lookup summary delivery data for multiple campaigns
        // without having to use an expensive SQL COUNT

        // Construct the increment query
        let incrementField = '';
        let recentStatus = 'unconfirmed';
        if (notificationType === 'Bounce') {
          recentStatus = 'bounce:';
          if (bounceType === 'Permanent') {
            incrementField = 'permanentBounceCount'
            recentStatus += 'permanent';
          } else if (bounceType === 'Transient') {
            incrementField = 'transientBounceCount';
            recentStatus += 'transient';
          } else {
            incrementField = 'undeterminedBounceCount';
            recentStatus = 'undetermined';
          }
        } else if (notificationType === 'Complaint') {
          incrementField = 'complaintCount'
          recentStatus = 'complaint';
        }

        if (incrementField) {
          CampaignAnalytics.findOne({
            where: { campaignId: updatedCampaignSubscriber.dataValues.campaignId }
          }).then(ParentCampaignAnalytics => {
            return ParentCampaignAnalytics.increment(incrementField);
          }).then(result => {
            return ListSubscriber.findById(updatedCampaignSubscriber.dataValues.listsubscriberId)
          }).then(listSubscriber => {
            listSubscriber.mostRecentStatus = recentStatus;

            // Should not re-send to email addresses that produces a permanent bounce, so we
            // handle this automatically for the user by unsubscribing the offending email.
            // https://docs.aws.amazon.com/ses/latest/DeveloperGuide/notification-contents.html
            if (recentStatus == 'bounce:permanent') {
              listSubscriber.subscribed = false;
            }

            return listSubscriber.save();
          }).then(result => {
            // alkjdlkjf
          }).catch(err => {
            throw err;
          });
        }
        done();
      } else {
        // Skip to deleting the SQS message if the messageId is invalid
        // (i.e. doesn't correspond to a CampaignSubscriber entry).
        // This might happen if the CampaignSubscriber rows were deleted
        // or the database reset while there were still
        done();
      }
    }).catch(err => {
      throw err;
    })
  }
}
