const Campaign = require('../../models').campaign;
const CampaignAnalytics = require('../../models').campaignanalytics;

const campaignPermission = require('../permissions/acl-lib/acl-campaign-permissions');

module.exports = (req, res) => {

  let userId = '';

  const access = campaignPermission(req.cookies.user, req.user.id)
    .then(userIdAndCampaigns => {
      // userIdAndCampaigns.userId must not equal 'None'
      if (userIdAndCampaigns.campaigns === 'None') {
        throw 'Permission denied';
      } else {
        userId = userIdAndCampaigns.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {

      // Find all campaigns belonging to a user & send it to them
      Campaign.findAll({
        where: {
          userId
        },
        include: [
          {
            model: CampaignAnalytics,  // Campaign summary analytics
            required: true,
            attributes: [
              'complaintCount',
              'permanentBounceCount',
              'transientBounceCount',
              'undeterminedBounceCount',
              'totalSentCount',
              'openCount',
              'clickthroughCount'
            ]
          }
        ],
        attributes: [
          'name',
          'fromName',
          'fromEmail',
          'emailSubject',
          'emailBody',
          'createdAt',
          'updatedAt',
          'id',
          'slug',
          'trackingPixelEnabled',
          'trackLinksEnabled',
          'unsubscribeLinkEnabled',
          'type'
        ],
        raw: true
      }).then(instancesArray => {
        if(instancesArray) {
          res.send(instancesArray);
        } else {
          res.send();
        }
      }).catch(() => {
        res.send();
      });

    })
    .catch(err => {
      res.status(400).send(err);
    });
};
