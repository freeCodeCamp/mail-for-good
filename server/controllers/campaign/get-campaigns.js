const Campaign = require('../../models').campaign;
const CampaignAnalytics = require('../../models').campaignanalytics;

module.exports = (req, res) => {
  // Find all campaigns belonging to a user & send it to them

  Campaign.findAll({
    where: {
      userId: req.user.id
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
      'type',
      'status'
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
};
