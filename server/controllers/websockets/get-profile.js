const User = require('../../models').user;

module.exports = function(req) {
  return User.findOne({
    where: {
      id: req.user.id
    }
  }).then(userInstance => {
    const userObject = userInstance.get({ plain:true });
    return userObject;
  });
};
