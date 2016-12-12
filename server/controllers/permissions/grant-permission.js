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

      OfferPermission.findOne({
        where: {
          userId: req.user.id,
          toUserId: String(userInstance.getDataValue('id'))
        }
      })
      .then(opInstance => {

        if (opInstance) {
          res.status(400).send({ message: 'You have already granted this user permissions. If you wish to change them, please delete them first' });
        } else {
          OfferPermission.create({
            userId: req.user.id,
            toUserId: String(userInstance.getDataValue('id')),
            toUserEmail: email,
            campaigns
          })
          .then(() => res.send({ message: 'Your offer to grant this user these permissions has been sent' }))
          .catch(err => {
            throw err;
          });
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
