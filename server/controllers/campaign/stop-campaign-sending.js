const {
  sequelize,
  campaign: Campaign,
  user: User,
} = require('../../models');



  // If req.body.id was not supplied or is not a number, cancel
  if (!req.body.id || typeof req.body.id !== 'number') {
    res.status(400).send();
    return;
  }
  const userId = req.user.id;
  const campaignId = req.body.id;

  Campaign.findOne({
    where: {
      userId,
      id: campaignId
    },
    raw: true
  }).then(campaign => {
    if (campaign) {
      res.send();
    } else {
      res.status(400).send();
    }
  });
}
