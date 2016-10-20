const AWS = require('aws-sdk');
const CampaignSubscriber = require('../../models').campaignsubscriber;

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
          CampaignSubscriber.update (
            { status: email.notificationType },
            { where: { messageId: email.mail.messageId } }
          ).then(result => {
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

