const OfferPermission = require('../../models').offerPermission;

module.exports = function(req, res) {

  OfferPermission.findAll({
    where: {
      toUserId: String(req.user.id)
    },
    attributes: [
      'id',
      'toUserEmail',
      'campaigns',
      'createdAt',
      'updatedAt'
    ],
    raw: true
  })
  .then(receivedPermissionArray => {
    if (!receivedPermissionArray.length) {
      res.send();
    } else {
      res.send(receivedPermissionArray);
    }
  })
  .catch(err => {
    throw err;
  });
};
