const ACL = require('../../../models').acl;

module.exports = function(id) {

  /*
    Returns a promise containing the type of permission granted
  */

  return ACL.findById(id)
    .then(userInstance => {
      if (userInstance) {
        console.log(userInstance);
        const campaignAccess = {
          campaigns: userInstance.getDataValue('campaigns'),
          userId: userInstance.getDataValue('userId')
        };
        return campaignAccess;
      } else {
        throw 'Permission denied';
      }
    })
    .catch(err => {
      throw err;
    });
};
