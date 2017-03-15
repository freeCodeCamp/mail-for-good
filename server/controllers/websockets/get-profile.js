const User = require('../../models').user;

module.exports = function(id) {
  return User.findOne({
    where: {
      id: id
    },
    attributes: ['picture', 'email', 'createdAt', 'name', 'sentEmailsCount']
  }).then(userInstance => {
    const userObject = userInstance.get({ plain:true });
    return userObject;
  });
};
