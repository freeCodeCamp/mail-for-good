const db = require('../../../../../models');

/**
 * @description Change the campaign status on finishing a campaign send
 * @param {boolean} cancelCampaignSend - Flag for whether or not this campaign was cancelled
 * @param {object} campaignInfo - Information about this campaign
 */

module.exports = (cancelCampaignSend, campaignInfo) => {
  const status = cancelCampaignSend ? 'interrupted' : 'done';
  db.campaign.update({
    status
  }, {
    where: {
      id: campaignInfo.campaignId
    }
  });
};
