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
        }
      }).then(listSubscriber => {
        if (listSubscriber) {
          res.status(400)
            .send({
              status: 'error', // Redundant
              message:'This email already exists'
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
