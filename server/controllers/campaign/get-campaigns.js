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
          'clickthroughCount'
        ]
      }
    ],
    attributes: [
      'name', 'createdAt', 'updatedAt', 'id', 'slug'
    ],
    raw: true
  }).then(instancesArray => {
    res.send(instancesArray);
  });
}
