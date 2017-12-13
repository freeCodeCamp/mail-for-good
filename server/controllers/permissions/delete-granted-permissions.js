const ACL = require('../../models').acl;

module.exports = (req, res) => {

  let { offerIds } = req.body; // List of ids in acl to delete
  offerIds = typeof offerIds === 'object' ? offerIds : [offerIds];
  offerIds = offerIds.map(x => Number(x));

  ACL.destroy({
    where: {
      id: { in: offerIds },
      userId: String(req.user.id)
    }
  })
  .then(() => {
    res.send({ message: 'You are no longer granting this user these permissions' });
  })
  .catch(err => {
    throw err;
  });
};
