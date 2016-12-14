const campaign = require('../../models').campaign;

const campaignPermission = require('../permissions/acl-lib/acl-campaign-permissions');

module.exports = (req, res) => {
  const campaignIds = req.body.data;

  let userId = '';

  const access = campaignPermission(req.cookies.user, req.user.id)
    .then(userIdAndCampaigns => {
      // userIdAndCampaigns.userId must equal 'Write'
      if (userIdAndCampaigns.campaigns !== 'Write') {
        throw 'Permission denied';
      } else {
        userId = userIdAndCampaigns.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {

    campaign.destroy({
      where: {
        id: { in: campaignIds },
        userId
      }
    }).then(numDeleted => {
      if (numDeleted) {
        res.send();
      } else {
        res.status(404).send();
      }
    }).catch(err => {
      throw err;
    });

  });
};
