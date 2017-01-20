const Campaign = require('./models').campaign;


/**
 * Update statuses to correct the database state after shutdown/crash of the app.
 * Example: if a campaign is sending (status: 'sending') when the app stops,
 * the status will still be 'sending' even though sending has been interrupted.
 * In this case, update the status to 'interrupted',
 * allowing the user to resume sending a campaign manually.
 */
module.exports = () => {
  return Campaign.update({
    status: 'interrupted'
  }, {
    where: { status: 'sending' }
  });
};
