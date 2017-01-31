const _ = require('lodash');
const Setting = require('../../models').setting;
const configureAws = require('./configure-aws/configure-aws');

module.exports = function(req, res) {
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

  // If any AWS settings have been changed then we need to reconfigure the feedback queues
  // This also serves as validation for AWS credentials
  if (selectProvidedFields.amazonSimpleEmailServiceAccessKey || selectProvidedFields.amazonSimpleEmailServiceSecretKey || selectProvidedFields.region) {
    console.log("aws settings provided")
    Setting.findOne({
      where: { userId: req.user.id },
      attributes: ['amazonSimpleEmailServiceAccessKey', 'amazonSimpleEmailServiceSecretKey', 'region']
    }).then(settingInstance => {
      const settings = _.extend(
        {
          amazonSimpleEmailServiceAccessKey: settingInstance.amazonSimpleEmailServiceAccessKey,
          amazonSimpleEmailServiceSecretKey: settingInstance.amazonSimpleEmailServiceSecretKey,
          region: settingInstance.region
        }, selectProvidedFields);

      configureAws({
        accessKey: settings.amazonSimpleEmailServiceAccessKey,
        secretKey: settings.amazonSimpleEmailServiceSecretKey,
        region: settings.region
      }, (err, queueUrl) => {
        if (err) {
          // Should add error messages here
          res.status(400).send();
        } else {
          console.log(`Created sqs feedback queue: ${queueUrl}`);
          selectProvidedFields.amazonSimpleQueueServiceUrl = queueUrl;
          updateSettings();
        }
      });
    });
  } else {
    updateSettings()
  }

  if (selectProvidedFields.regions) {
    const regions = ['us-west-2', 'us-east-1', 'eu-west-1']; // AWS SES regions
    if (~regions.indexOf(selectProvidedFields.regions)) {
      res.status(400).send();
      return;
    }
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























