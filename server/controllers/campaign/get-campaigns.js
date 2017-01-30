const Campaign = require('../../models').campaign;
const CampaignAnalytics = require('../../models').campaignanalytics;

module.exports = (req, res) => {

  const userId = req.user.id;

  // Find all campaigns belonging to a user & send it to them
  Campaign.findAll({
    where: {
      userId
    },
    include: [
      {
        model: CampaignAnalytics, // Campaign summary analytics
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
      'status',
      'totalCampaignSubscribers'
    ],
    raw: true
  }).then(instancesArray => {
    if (instancesArray) {
      res.send(instancesArray);
    } else {
      res.send();
    }
  }).catch(() => {
    res.send();
  }).catch(err => {
    res.status(400).send(err);
  });

};
