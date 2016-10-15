const campaign = require('../../models').campaign;

module.exports = (req, res) => {
  const campaignIds = req.body.data;

  campaign.destroy({
    where: {
      id: { in: campaignIds },
      userId: req.user.id
    }
  }).then(numDeleted => {
    if (numDeleted) {
      res.send();
    } else {
      res.status(404).send();
    }
  }).catch(err => {
    throw err;
    res.status(500).send();
  });
}
