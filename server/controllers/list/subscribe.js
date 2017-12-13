const ListSubscriber = require('../../models').listsubscriber;
const List = require('../../models').list;

module.exports = function(req, res) {
  const email = req.query.email;
  const subscribeKey = req.query.subscribeKey;

  List.findOne({
    where: { subscribeKey }
  }).then(list => {
    if (list) {
      const listId = list.dataValues.id;

      ListSubscriber.findOne({
        where: {
          listId,
          email
        },
        plain: true
      }).then(listSubscriber => {
        if (listSubscriber) {
          ListSubscriber.update(
            { subscribed: true },
            { where: { id: listSubscriber.id } }
          ).then(() => {
            res.status(201)
              .send({
                status: 'success', // Redundant
                message: `added successfully`
              });
          });
        } else {
          ListSubscriber.create({
            email, listId
          }).then(() => {
            res.status(201)
              .send({
                status: 'success', // Redundant
                message: `added succesfully`
              });
          });
        }
      });
    } else {
      res.status(400).send('invalid list subscriber key');
    }
  });
};
