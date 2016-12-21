const List = require('../../models').list;
const ListSubscriber = require('../../models').listsubscriber;

const listPermission = require('../permissions/acl-lib/acl-list-permissions');

module.exports = (req, res) => {

  const listIds = req.body.lists;
  let userId = '';

  const access = listPermission(req.cookies.user, req.user.id)
    .then(userIdAndLists => {
      // userIdAndCampaigns.lists must equal 'Write'
      if (userIdAndLists.lists !== 'Write') {
        throw 'Permission denied';
      } else {
        userId = userIdAndLists.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {
    List.destroy({
      where: { userId, id: listIds }
    })
    .then(() => {
      res.send('Lists deleted');
      // Deleting list subscribers may take some time.
      // Therefore we can respond when we know that the lists were deleted.
      // ListSubscribers will only be deleted when lists have themselves been destroyed.
      // Lists will only be destroyed if each listId has an id matching the userId
      ListSubscriber.destroy({
        where: { listId: listIds }
      });
    })
    .catch(() => {
      res.status(400).send('Failed to delete lists');
    });
  });
};
