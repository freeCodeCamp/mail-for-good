const ACL = require('../../models').acl;

module.exports = (req, res) => {

  let { offerIds } = req.body; // List of ids in acl to delete
  offerIds = typeof offerIds === 'object' ? offerIds : [offerIds];
  offerIds = offerIds.map(x => Number(x));

  ACL.destroy({
    where: {
      id: { in: offerIds },
      toUserId: String(req.user.id)
    }
  })
  .then(() => {
    res.send({ message: 'You no longer have access to these permissions' });
  })
  .catch(err => {
    throw err;
  });
};
