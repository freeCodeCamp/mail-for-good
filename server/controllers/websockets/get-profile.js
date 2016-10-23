const User = require('../../models').user;

module.exports = function(req) {
  return User.findOne({
    where: {
      id: req.user.id
    },
    attributes: ['picture', 'email', 'createdAt', 'name', 'sentEmailsCount']
  }).then(userInstance => {
    const userObject = userInstance.get({ plain:true });
    return userObject;
  });
};
