const OfferPermission = require('../../models').offerPermission;

module.exports = (req, res) => {

  let { offerIds } = req.body; // List of ids in offerPermission to reject
  offerIds = typeof offerIds === 'object' ? offerIds : [offerIds];
  offerIds = offerIds.map(x => Number(x));

  OfferPermission.destroy({
    where: {
      id: { in: offerIds },
      userId: req.user.id
    }
  })
  .then(() => {
    res.send({ message: 'You have deleted these permission offers' });
  })
  .catch(err => {
    throw err;
  });
};
