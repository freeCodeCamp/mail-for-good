const _ = require('lodash');
const Setting = require('../models').setting;

module.exports = function(req, res) {
  const settingsToChange = _.pickBy(req.body);

  // Exit if there are no settings to change
  if (_.isEmpty(settingsToChange)) {
    res.status(400).send({message: 'The SES credentials form is empty'});
    return;
  }

  /*
    TODO: Check settingsToChange.amazonSimpleEmailServiceAccessKey and settingsToChange.amazonSimpleEmailServiceSecretKey for validity using regex
    TODO: Need to encrypt these keys
 */

 const selectProvidedFields = {};
 Object.keys(settingsToChange).forEach(key => {
   if (settingsToChange[key]) { // Implicity check field is not empty
     selectProvidedFields[key] = settingsToChange[key];
   }
 });

  Setting.update(selectProvidedFields,
    {
    where: {
      userId: req.user.id
    }
  }).then(() => {
    res.send({message: 'SES credentials saved'});
  }).catch(() => {
    res.status(500).send();
  });
};
