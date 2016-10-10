const campaign = require('../../models').campaign;

module.exports = (req, res) => {
  // Find all campaigns belonging to a user & send it to them
  campaign.findAll({
    where: {
      userId: req.user.id
    },
    attributes: [
      'name', 'createdAt', 'updatedAt', 'id', 'slug'
    ],
    raw: true
  }).then(instancesArray => {
    res.status(200).send(instancesArray);
  });
}
