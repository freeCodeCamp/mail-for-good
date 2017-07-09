const Campaign = require('../../models').campaign;
const User = require('../../models').user;


/**
 * Update statuses to correct the database state after shutdown/crash of the app.
 * Example: if a campaign is sending (status: 'sending') when the app stops,
 * the status will still be 'sending' even though sending has been interrupted.
 * In this case, update the status to 'interrupted',
 * allowing the user to resume sending a campaign manually.
 */
module.exports = () => {
  // If there are no users then the database is
  // probably fresh + there is no need to
  // update anything
  return User.findAll({ raw: true })
    .then(users => {
      if (users.length) {
        Campaign.update({
          status: 'interrupted'
        }, {
          where: { status: 'sending' }
        });
      }
      return null;
    })
    // If the promise is rejected, the table doesn't exist. This is fine, as it may be the first
    // time the app was run. We can discard the error.
    .catch(() => {});
};
