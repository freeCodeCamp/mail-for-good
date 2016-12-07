const Setting = require('../../models').setting;

module.exports = function(req, res) {

  /*
    NOTE: This file returns boolean values to the client for fields that have values assigned.
  */

  Setting.findOne({
    where:{
      userId: req.user.id
    }
  }).then(settingsInstance => {
    const settingsObject = settingsInstance.get({ plain:true });
    const settingsObjectToBool = {};
    Object.keys(settingsObject).forEach(key => settingsObjectToBool[key] = true);
    res.send(settingsObjectToBool);
  }).catch(err => res.status(500).send(err));

};
