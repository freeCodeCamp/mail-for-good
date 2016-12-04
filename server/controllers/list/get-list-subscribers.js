const list = require('../../models').list;
const listsubscriber = require('../../models').listsubscriber;

module.exports = (req, res) => {
  // Find all subscribers belonging to a list
  const userId = req.user.id;
  const listId = req.query.listId;
  const offset = req.query.offset;
  const limit = req.query.limit;

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
        offset: ( offset - 1) * limit,
        limit,
        order: [ ['id', 'ASC'] ],
        attributes: ['id', 'email', 'subscribed', 'createdAt', 'updatedAt', 'mostRecentStatus'],
        raw: true
      }).then(instancesArray => {
        res.send({ subscribers: instancesArray });
      });
    }
  });
};
