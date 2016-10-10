const db = require('../../models');

module.exports = (req, res) => {
  /*
  Req.body has fornat:
  { id: 1 }
  */
  // If req.body.id was not supplied or is not a number, cancel
  if (!req.body.id || typeof req.body.id !== 'number') {
    res.status(400).send();
    return;
  }

  function *sendCampaign() {
    const userId = req.user.id;
    const campaignId = req.body.id;

    // Campaign belongs to user?
    yield campaignBelongsToUser(userId, campaignId);
    
    console.log('belongstouser');

  }

  const generator = sendCampaign();
  generator.next();

  // Validate the campaign belongs to the user
  function campaignBelongsToUser(userId, campaignId) {
    db.campaign.findOne({
      where: {
        id: campaignId,
        userId: userId
      }
    }).then(campaignInstance => {
      if (!campaignInstance) {
        res.status(401).send();
      } else {
        generator.next();
      }
    }).catch(err => {
      throw err;
    });
  }
}
