const List = require('../../models').list;
const ListSubscriber = require('../../models').listsubscriber;

module.exports = (req, res) => {
  // Find all subscribers belonging to a list
  const userId = req.user.id;
  const listId = req.query.listId;

  List.findOne({
    where: {
      userId,
      id: listId
    },
    attributes: ['id'],
    raw: true
  }).then(list => {
    if (!list) {
      res.status(401)  //??
        .send({
          message: 'not authorised to view list or list does not exist'
        });
    } else {
      res.setHeader('Content-disposition', 'attachment; filename=listsubscribers.csv');
      res.setHeader('Content-type', 'text/csv');
      res.write('email,subscribed,mostrecentstatus');

      sendSubscribers();

      function sendSubscribers(offset=0, limit=5000) {
        ListSubscriber.findAll({
          where: { listId },
          offset,
          limit,
          attributes: ['email', 'subscribed', 'mostRecentStatus']
        }).then(listSubscribers => {
          if (listSubscribers.length) {
            listSubscribers.forEach(listSubscriber => {
              const data = listSubscriber.dataValues;
              res.write(`${data.email},${data.subscribed},${data.mostRecentStatus}\n`);
            })
            sendSubscribers(offset + limit)
          } else {
            res.end();
            return;
          }
        })
      }
    }
  });
};
