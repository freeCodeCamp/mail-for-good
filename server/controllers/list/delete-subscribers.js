const List = require('../../models').list;
const ListSubscriber = require('../../models').listsubscriber;

const listPermission = require('../permissions/acl-lib/acl-list-permissions');

module.exports = (req, res) => {

  const listSubscriberIds = req.body.listSubscribers;
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
          res.status(404).send();
        }
      });
    }).catch(() => {
      res.status(500).send('Failed to delete subscribers');
    });
  });
};
