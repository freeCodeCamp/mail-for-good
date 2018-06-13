const _ = require('lodash');
const Setting = require('../../models').setting;
const configureAws = require('./configure-aws/configure-aws');

module.exports = function(req, res, redis) {
  const settingsToChange = _.pickBy(req.body);

  // Exit if there are no settings to change
  if (_.isEmpty(settingsToChange)) {
    res.status(400).send();
    return;
  }

  /*
    NOTE: There's no need to include any response message as the settings are validated client side
 */

  // Quick function to create a new object selectProvidedFields that contains keys from settingsToChange whose property was not an empty string (or otherwise falsey value)
  const selectProvidedFields = {};
  Object.keys(settingsToChange).forEach(key => {
    if (settingsToChange[key]) { // Implicity check field is not empty
      selectProvidedFields[key] = settingsToChange[key];
    }
  });

  if (selectProvidedFields.accessKey) {
    if (selectProvidedFields.accessKey.length < 16 || selectProvidedFields.accessKey.length > 32) {
      res.status(400).send({message: "Provided access key is invalid"});
      return;
    }
  }

  if (selectProvidedFields.secretAccessKey) {
    if (selectProvidedFields.secretAccessKey.length < 40) {
      res.status(400).send({message: "Provided secret access key is invalid"});
      return;
    }
    else if (/[0-9a-f]{40}/.test(selectProvidedFields.secretAccessKey)) {
      res.status(400).send({message: "Provided secret access key is invalid"});
      return;
    }
  }

  if (selectProvidedFields.regions) {
    const regions = ['us-west-2', 'us-east-1', 'eu-west-1']; // AWS SES regions
    if (~regions.indexOf(selectProvidedFields.regions)) {
      res.status(400).send();
      return;
    }
  }

  // If any AWS settings have been changed then we need to reconfigure the feedback queues
  // This also serves as advanced validation for AWS credentials
  if (selectProvidedFields.amazonSimpleEmailServiceAccessKey || selectProvidedFields.amazonSimpleEmailServiceSecretKey || selectProvidedFields.region || selectProvidedFields.email ) {
    console.log("AWS settings provided, reconfiguring AWS");
    Setting.findOrCreate({
      where: { userId: req.user.id },
      attributes: ['amazonSimpleEmailServiceAccessKey', 'amazonSimpleEmailServiceSecretKey', 'region', 'email', 'userId']
    }).then(settingInstance => {
      const settings = _.extend(
        {
          amazonSimpleEmailServiceAccessKey: settingInstance.amazonSimpleEmailServiceAccessKey,
          amazonSimpleEmailServiceSecretKey: settingInstance.amazonSimpleEmailServiceSecretKey,
          region: settingInstance.region,
          email: settingInstance.email,
          userId: req.user.id
        }, selectProvidedFields);

      configureAws({
        accessKey: settings.amazonSimpleEmailServiceAccessKey,
        secretKey: settings.amazonSimpleEmailServiceSecretKey,
        region: settings.region,
        email: settings.email
      }, (err, queueUrl) => {
        if (err) {
          console.log("Error creating sqs feedback queue");
          console.log(err);
          updateSettings();
          redis.publisher.publish('change-settings', 'changed');
          res.status(400).send({message: err.message});
        } else {
          console.log(`Created sqs feedback queue: ${queueUrl}`);
          selectProvidedFields.amazonSimpleQueueServiceUrl = queueUrl;
          updateSettings();
          redis.publisher.publish('change-settings', 'changed');
        }
      });
    });
  } else {
    // No AWS settings have been provided, there is no need to reconfigure AWS,
    // so we can go ahead and update the database.
    updateSettings();
  }

  function updateSettings () {
    Setting.update(selectProvidedFields, {
      where: {
        userId: req.user.id
      }
    }).then(() => {
      res.send();
    }).catch(() => {
      res.status(500).send();
    });
  }
};
