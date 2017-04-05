const Setting = require('../../models').setting;

module.exports = function(req, res) {

  /*
    NOTE: This file returns boolean values to the client for fields that have values assigned.
  */

  Setting.findOne({
    where:{
      userId: req.user.id
    },
    attributes: [
      'amazonSimpleEmailServiceAccessKey',
      'amazonSimpleEmailServiceSecretKey',
      'amazonSimpleQueueServiceUrl',
      'region',
      'whiteLabelUrl',
      'email'
    ]
  }).then(settingsInstance => {
    const settingsObject = settingsInstance.get({ plain:true });
    const settingsObjectToBool = {};
    Object.keys(settingsObject).forEach(key => {
      if (settingsObject[key])
        settingsObjectToBool[key] = true;
    });
    res.send(settingsObjectToBool);
  }).catch(err => res.status(500).send(err));

};
