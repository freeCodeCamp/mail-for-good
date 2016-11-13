const _ = require('lodash');
const Setting = require('../models').setting;

module.exports = function(req, res) {
  const settingsToChange = _.pickBy(req.body);

  // Exit if there are no settings to change
  if (_.isEmpty(settingsToChange)) {
    res.status(400).send();
    return;
  }

  /*
    NOTE: There's no need to include any response message as the settings are validated client side
    TODO: Need to encrypt these keys
 */

  // Quick function to create a new object selectProvidedFields that contains keys from settingsToChange whose property was not an empty string (or otherwise falsey value)
  const selectProvidedFields = {};
  Object.keys(settingsToChange).forEach(key => {
    if (settingsToChange[key]) { // Implicity check field is not empty
      selectProvidedFields[key] = settingsToChange[key];
    }
  });

  // All checks below are pretty self explanatory
  if (selectProvidedFields.accessKey) {
    if (selectProvidedFields.accessKey.length < 16 || selectProvidedFields.accessKey.length > 32) {
      res.status(400).send();
      return;
    }
  }

  if (selectProvidedFields.secretAccessKey) {
    if (selectProvidedFields.secretAccessKey.length < 40) {
      res.status(400).send();
      return;
    }
    else if (/[0-9a-f]{40}/.test(selectProvidedFields.secretAccessKey)) {
      res.status(400).send();
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

  Setting.update(selectProvidedFields, {
    where: {
      userId: req.user.id
    }
  }).then(() => {
    res.send();
  }).catch(() => {
    res.status(500).send();
  });
};
