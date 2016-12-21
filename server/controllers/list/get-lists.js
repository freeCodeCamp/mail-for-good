const list = require('../../models').list;

const listPermission = require('../permissions/acl-lib/acl-list-permissions');

module.exports = (req, res) => {
  // Find all lists belonging to a user & send it to them
  let userId = '';

  const access = listPermission(req.cookies.user, req.user.id)
    .then(userIdAndLists => {
      // userIdAndCampaigns.lists must not equal 'None'
      if (userIdAndLists.lists === 'None') {
        throw 'Permission denied';
      } else {
        userId = userIdAndLists.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {
    list.findAll({
      where: {
        userId: userId
      },
      attributes: [
        'name', 'subscribeKey', 'createdAt', 'updatedAt', 'id', 'additionalFields'
      ],
      raw: true
    }).then(instancesArray => {
      if (instancesArray) {
        res.send(instancesArray);
      } else {
        res.send();
      }
    }).catch(() => res.send());
  });
};
