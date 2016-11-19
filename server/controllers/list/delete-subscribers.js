const List = require('../../models').list;
const ListSubscriber = require('../../models').listsubscriber;

module.exports = (req, res) => {
  const userId = req.user.id;
  const listSubscriberIds = req.body.listSubscribers;

  List.findAll({
    where: { userId },
    attributes: [ 'id' ]
  }).then(result => {
    const ownedListIds = result.map(list => {
      return list.id;
    });

    ListSubscriber.destroy({
      where: {
        id: listSubscriberIds,
        listId: ownedListIds
      }
    }).then(numDeleted => {
      if (numDeleted) {
        res.send('Subscribers deleted');
      } else {
        res.status(404).send('Subscribers not found');
      }
    })
    .catch(() => res.status(500).send('Failed to delete subscribers'));
  })
  .catch(() => res.status(500).send('Failed to delete subscribers'));
};
