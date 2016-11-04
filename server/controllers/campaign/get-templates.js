const Template = require('../../models').template;

module.exports = (req, res) => {
  // Find all campaigns belonging to a user & send it to them
  Template.findAll({
    where: {
      userId: req.user.id
    },
    attributes: [
      'name', 'createdAt', 'updatedAt', 'id'
    ],
    raw: true
  }).then(instancesArray => {
    res.send(instancesArray);
  });
};
