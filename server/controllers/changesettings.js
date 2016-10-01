'use strict'
const _ = require('lodash');
const Settings = require('../models').settings;


module.exports =  function(req, res) {
  const settingsToChange = _.pickBy(req.body);

  // Exit if there are no settings to change
  if (_.isEmpty(settingsToChange)) {
    res.status(400)
        .send({
      type: 'error', // Redundant
      message: 'SES credentials form was empty'
    });
    return;
  }

  /*
    Previous model needs to be refactored. Code left below for reference.
  */
}

/*
// Should eventually refactor this to use findOneAndSave
Settings.findOne({}, {}, (err, settings) => {
  if (err) throw err;

  // Create default settings if none exist
  if (!settings) {
    settings = Settings(settingsToChange);
  } else {
    _.keys(settingsToChange).forEach((setting) => {
      settings[setting] = settingsToChange[setting]
    });
  }

  settings.save((err) => {
    if (err) throw err;
    res.json({})
  });
})
*/
