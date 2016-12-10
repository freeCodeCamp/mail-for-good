const OfferPermission = require('../../models').offerPermission;
const User = require('../../models').user;

module.exports = function(req, res) {

  const { email, campaigns } = req.body;

  User.findOne({
    where: {
      email
    }
  })
  .then(userInstance => {
    if(!userInstance) {
      res.status(400).send({ message: 'This user does not exist' });
    } else {

      OfferPermission.findOrCreate({
        where: {
          userId: req.user.id,
          toUserId: String(userInstance.getDataValue('id'))
        },
        defaults: {
          toUserId: String(userInstance.getDataValue('id')),
          campaigns
        }
      })
      .then((opInstance, created) => {
        if (created) {
          res.status(400).send({ message: 'You have already granted this user permissions. If you wish to change them, please delete them first' });
        } else {
          res.send({ message: 'Your offer to grant this user these permissions has been sent' });
        }
      })
      .catch(err => {
        throw err;
      });

    }
  })
  .catch(err => {
    throw err;
  });
};
