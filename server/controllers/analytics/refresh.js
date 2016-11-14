const AWS = require('aws-sdk');
const CampaignSubscriber = require('../../models').campaignsubscriber;
const CampaignAnalytics = require('../../models').campaignanalytics;
const ListSubscriber = require('../../models').listsubscriber;

module.exports = function(req, res) {

  // testing SQS delivery status stuff
  let sqs = new AWS.SQS({
    accessKeyId: process.env.AWS_ACCESS,
    secretAccessKey: process.env.AWS_SECRET,
    region: `eu-west-1`
  });

  var receiveMessageParams = {
    QueueUrl: process.env.AWS_SQS_QUEUE_URL,
    WaitTimeSeconds: 20,
    MaxNumberOfMessages: 10
  };

  function getMessages() {
    sqs.receiveMessage(receiveMessageParams, receiveMessageCallback);
  }

  function deleteMessageCallback(err, data) {
  }

  function receiveMessageCallback(err, data) {
    if (err) {
      console.log(err);
    }

    if (data && data.Messages && data.Messages.length > 0) {
      data.Messages.forEach((message) => {
        const email = JSON.parse(JSON.parse(message.Body).Message);

        if (email && email.notificationType && email.mail && email.mail.messageId ) {

          const notificationType = email.notificationType
          let bounceType = '';
          let bounceSubType = '';
          if (notificationType === 'Bounce' && email.bounce) {
            bounceType = email.bounce.bounceType;
            bounceSubType = email.bounce.bounceSubType;
          }

          CampaignSubscriber.update (
            { status: notificationType, bounceType, bounceSubType },
            {
              where: { messageId: email.mail.messageId },
              returning: true  // only supported in postgres
            }
          ).then(result => {
            // Skip to deleting the SQS message if the messageId is invalid
            // (i.e. doesn't correspond to a CampaignSubscriber entry).
            // This should only happen if the CampaignSubscriber row
            // has been deleted or the SQS message is dodgy
            if (result[0]) {
              const updatedCampaignSubscriber = result[1][0];

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
                  return listSubscriber.save();
                }).then(result => {
                  console.log("updated CampaignAnalytics");
                });
              }
            }
            sqs.deleteMessage({
              QueueUrl: receiveMessageParams.QueueUrl,
              ReceiptHandle: message.ReceiptHandle
            }, deleteMessageCallback)
          })
        }
      })
    }

    getMessages();
  }

  getMessages();
}

