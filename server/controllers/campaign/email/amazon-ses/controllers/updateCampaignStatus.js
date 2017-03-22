const db = require('../../../../../models');

/**
 * @description Update the campaign status to 'sending'
 * @param {object} campaignInfo - Information about this campaign
 */

module.exports = (campaignInfo) => {
  function updateCampaignStatus() {
    db.campaign.update({
      status: 'sending'
    }, {
      where: {
        id: campaignInfo.campaignId
      }
    }).catch(err => {throw err;});
  }

  return updateCampaignStatus();
};
