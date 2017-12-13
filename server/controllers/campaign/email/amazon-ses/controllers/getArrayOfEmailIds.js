const db = require('../../../../../models');

/**
 * @description Get all the 'listsubscriber' ids we will email
 * @param {object} campaignInfo - Information about this campaign
 * @return {array} Plain array of unique listsubscriber ids {number}, we will email these users.
 */

module.exports = (campaignInfo) => {
  function getListSubscriberIds() {
    return db.listsubscriber.findAll({
      where: {
        listId: campaignInfo.listId,
        subscribed: true
      },
      include: [{
        model: db.campaignsubscriber,
        where: {
          campaignId: campaignInfo.campaignId,
          sent: false
        }
      }],
      attributes: [
        'id'
      ],
      raw: true
    })
    .then(instances => {
      const plainArrayOfIdNumbers = instances.map(x => x.id);
      return plainArrayOfIdNumbers;
    })
    .catch(err => {
      // This should never happen - so we can throw an error here if it does.
      throw new Error('Error getting list subscribers ids in getArrayOfEmailIds - ', err);
    });
  }

  return getListSubscriberIds();
};
