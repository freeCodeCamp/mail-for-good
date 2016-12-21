const Template = require('../../models').template;

const templatePermission = require('../permissions/acl-lib/acl-template-permissions');

module.exports = (req, res) => {

  let userId = '';

  const access = templatePermission(req.cookies.user, req.user.id)
    .then(userIdAndTemplates => {
      // userIdAndCampaigns.templates must not equal 'None'
      if (userIdAndTemplates.templates === 'None') {
        throw 'Permission denied';
      } else {
        userId = userIdAndTemplates.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {
    // Find all campaigns belonging to a user & send it to them
    Template.findAll({
      where: {
        userId: userId
      },
      raw: true
    }).then(instancesArray => {
      res.send(instancesArray);
    });
  });
};
