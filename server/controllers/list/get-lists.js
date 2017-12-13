const list = require('../../models').list;

module.exports = (req, res) => {
  // Find all lists belonging to a user & send it to them
  let userId = req.user.id;

  list.findAll({
    where: {
      userId
    },
    attributes: [
      'name',
      'subscribeKey',
      'createdAt',
      'updatedAt',
      'id',
      'additionalFields',
      'status',
      'total'
    ],
    raw: true
  }).then(instancesArray => {
    if (instancesArray) {
      res.send(instancesArray);
    } else {
      res.send();
    }
  }).catch(() => res.send());
};
