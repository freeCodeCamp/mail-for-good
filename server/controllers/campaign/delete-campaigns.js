const campaign = require('../../models').campaign;

module.exports = (req, res) => {
  const campaignIds = req.body.data;

  const userId = req.user.id;

  campaign.destroy({
    where: {
      id: { in: campaignIds
      },
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
};
