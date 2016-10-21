const AWS = require('aws-sdk');
const CampaignSubscriber = require('../../models').campaignsubscriber;
const CampaignAnalytics = require('../../models').campaignanalytics;

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
            const updatedCampaignSubscriber = result[1][0];

            let incrementField = '';
            if (notificationType === 'Bounce') {
              if (bounceType === 'Permanent') {
                incrementField = 'permanentBounceCount'
              } else if (bounceType === 'Transient') {
                incrementField = 'transientBounceCount';
              } else {
                incrementField = 'undeterminedBounceCount';
              }
            } else if (notificationType === 'Complaint') {
              incrementField = 'complaintCount'
            }

            if (incrementField) {
              CampaignAnalytics.findOne({
                where: { campaignId: updatedCampaignSubscriber.dataValues.campaignId }
              }).then(ParentCampaignAnalytics => {
                return ParentCampaignAnalytics.increment(incrementField);
              }).then(result => {
                console.log("updated CampaignAnalytics");
              })
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

