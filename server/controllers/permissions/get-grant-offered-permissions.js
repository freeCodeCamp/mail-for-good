const ACL = require('../../models').acl;

module.exports = function(req, res) {

  ACL.findAll({
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
  .then(permissionArray => {
    if (!permissionArray.length) {
      res.send();
    } else {
      res.send(permissionArray);
    }
  })
  .catch(err => {
    throw err;
  });
};
