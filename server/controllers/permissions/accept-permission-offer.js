const sequelize = require('../../models').sequelize;
const OfferPermission = require('../../models').offerPermission;
const ACL = require('../../models').acl;

module.exports = function(req, res) {

  let { offerIds } = req.body.data; // List of ids in offerPermission to accept
  offerIds = typeof offerIds === 'object' ? offerIds : [offerIds];
  offerIds = offerIds.map(x => Number(x));

  OfferPermission.findAll({
    where: {
      id: { in: offerIds },
      toUserId: String(req.user.id)
    },
    raw: true
  })
  .then(offerPermissions => {
    if (!offerPermissions) {
      res.status(400).send({ message: 'An error occurred, please refresh the page' });
      return null;
    } else {
      return sequelize.transaction(transaction => {
        offerPermissions = offerPermissions.map(x => {
          x.userId = String(x.userId);
          return x;
        });
        
        return ACL.bulkCreate(offerPermissions, { transaction })
        .then(() => {
          return OfferPermission.destroy({
            where: {
              id: { in: offerIds }
            }
          }, { transaction });
        });
      })
      .then(() => res.send({ message: `Offer${offerIds.length > 1 ? 's' : ''} accepted, you have now been granted access` }))
      .catch(() => res.status(400).send({ message: 'An error occurred, please refresh the page' }));
    }
  })
  .catch(err => {
    throw err;
  });

};
