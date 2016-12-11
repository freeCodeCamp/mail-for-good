const sequelize = require('../../models').sequelize;
const OfferPermission = require('../../models').offerPermission;
const ACL = require('../../models').acl;

module.exports = function(req, res) {

  const { offerIds } = req.body; // List of ids in offerPermission to accept

  OfferPermission.findAll({
    where: {
      toUserId: { in: offerIds }
    },
    raw: true
  })
  .then(offerPermissions => {
    if (!offerPermissions) {
      res.status(400).send({ message: 'An error occurred, please refresh the page' });
      return null;
    } else {
      return sequelize.transaction(transaction => {
        ACL.bulkCreate(offerPermissions, { transaction });
        OfferPermission.destroy({ where: { in: offerIds }}, { transaction });
      })
      .then(() => res.send({ message: `Offer${offerIds.length > 1 ? 's' : ''} accepted, you have now been granted access` }))
      .catch(() => res.status.send({ message: 'An error occurred, please refresh the page' }));
    }
  })
  .catch(err => {
    throw err;
  });

};
