const list = require('../../models').list;
const listsubscriber = require('../../models').listsubscriber;

module.exports = (req, res) => {
  // Find all subscribers belonging to a list
  const userId = req.user.id;
  const listId = req.query.listId;

  list.findOne({
    where: {
      userId,
      id: listId
    },
    attributes: ['name', 'createdAt', 'updatedAt'],
    raw: true
  }).then(instancesArray => {
    if (!instancesArray) {
      res.status(401)  //??
        .send({
          message: 'not authorised to view list or list does not exist'
        });
      return;
    } else {
      listsubscriber.findAll({
        where: { listId },
        attributes: ['email', 'subscribed', 'createdAt', 'updatedAt', 'mostRecentStatus'],
        raw: true
      }).then(instancesArray => {
        res.send({ subscribers: instancesArray });
      });
    }
  });
};
