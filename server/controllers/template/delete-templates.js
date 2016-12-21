const Template = require('../../models').template;

const templatePermission = require('../permissions/acl-lib/acl-template-permissions');

module.exports = (req, res) => {

  let userId = '';

  const access = templatePermission(req.cookies.user, req.user.id)
    .then(userIdAndTemplates => {
      // userIdAndCampaigns.templates must equal 'Write'
      if (userIdAndTemplates.templates !== 'Write') {
        throw 'Permission denied';
      } else {
        userId = userIdAndTemplates.userId;
        return null;
      }
    });

  Promise.all([access])
    .then(() => {

    const templateIds = req.body.data;

    Template.destroy({
      where: {
        id: { in: templateIds },
        userId: userId
      }
    }).then(numDeleted => {
      if (numDeleted) {
        res.send();
      } else {
        res.status(404).send();
      }
    }).catch(() => {
      res.status(500).send();
    });
  });
};
