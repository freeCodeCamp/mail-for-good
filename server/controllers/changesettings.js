'use strict'
const _ = require('lodash');
const db = require('../models');
const User = db.user;
const sequelize = db.sequelize;

module.exports = function(req, res) {
    const settingsToChange = _.pickBy(req.body);

    // Exit if there are no settings to change
    if (_.isEmpty(settingsToChange)) {
        res.status(400)
            .send({
                message: 'SES credentials form is empty'
            });
        return;
    }

    /*
    TODO: Check settingsToChange.amazonSimpleEmailServiceAccessKey and settingsToChange.amazonSimpleEmailServiceSecretKey for validity using regex
 */
    User.update({
        amazonSimpleEmailServiceAccessKey: settingsToChange.amazonSimpleEmailServiceAccessKey,
        amazonSimpleEmailServiceSecretKey: settingsToChange.amazonSimpleEmailServiceSecretKey
    }, {
        where: {
            id: req.user.id
        }
    }).then(result => {
        res.status(201)
            .send({
                message: 'SES credentials saved'
            });
    }).catch(err => {
        throw err;
    });

}
