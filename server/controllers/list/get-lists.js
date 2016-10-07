const list = require('../../models').list;

module.exports = (req, res) => {
  // Find all lists belonging to a user & send it to them
  list.findAll({
    where: {
      userId: req.user.id
    },
    attributes: [
      'name', 'createdAt', 'updatedAt'
    ],
    raw: true
  }).then(instancesArray => {
    res.status(200).send(instancesArray);
  });
}
