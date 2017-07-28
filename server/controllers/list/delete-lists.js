const List = require('../../models').list;
const ListSubscriber = require('../../models').listsubscriber;

module.exports = (req, res) => {

  const userId = req.user.id;
  const listIds = req.body.lists;

  List.destroy({
    where: { userId, id: listIds }
  })
  .then(() => {
    res.send('Lists deleted');
    // Deleting list subscribers may take some time.
    // Therefore we can respond when we know that the lists were deleted.
    // ListSubscribers will only be deleted when lists have themselves been destroyed.
    // Lists will only be destroyed if each listId has an id matching the userId
    return ListSubscriber.destroy({
      where: { listId: listIds }
    });
  })
  .catch(() => {
    res.status(400).send('Failed to delete lists');
  });
};
