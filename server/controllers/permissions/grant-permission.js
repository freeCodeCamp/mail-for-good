const OfferPermission = require('../../models').offerPermission;
const ACL = require('../../models').acl;
const User = require('../../models').user;

module.exports = function(req, res) {

  const { email, campaigns, templates, lists } = req.body;

  // Validate that campaigns, templates & lists equal 'None', 'Read' or 'Write'
  const validPermissions = ['None', 'Read', 'Write'];
  const validateCampaigns = ~validPermissions.indexOf(campaigns);
  const validateTemplates = ~validPermissions.indexOf(templates);
  const validateLists = ~validPermissions.indexOf(lists);

  // Critical that these fields are not malformed. If they are, throw an early error here.
  if (!validateCampaigns || !validateTemplates || !validateLists) {
    // Is checked client side, so no message response is necessary
    res.status(400).send();
    return;
  }

  function *grantPermission() {
    const offeredUserInstance = yield userToOfferPermissions();
    const authUserInstance = yield authUser();
    yield getAcl(offeredUserInstance);
    yield getOfferPermission(offeredUserInstance);

    OfferPermission.create({
      userId: req.user.id,
      fromUserEmail: authUserInstance.getDataValue('email'),
      toUserId: String(offeredUserInstance.getDataValue('id')),
      toUserEmail: email,
      campaigns,
      templates,
      lists
    })
    .then(() => res.send({ message: 'Your offer to grant this user these permissions has been sent' }))
    .catch(err => {
      throw err;
    });
  }

  const generator = grantPermission();
  generator.next();

  // Get user instance of user account to offer permissions to
  function userToOfferPermissions() {
    User.findOne({
      where: {
        email
      }
    })
    .then(userInstance => {
      if(!userInstance) {
        res.status(400).send({ message: 'This user does not exist' });
        throw 'Grant-Permission - User does not exist';
      }
      else if (userInstance.getDataValue('id') === req.user.id) {
        // Disallow sending offers to self
        res.status(400).send({ message: 'You cannot offer yourself permissions' });
        throw 'Grant-Permission - Cannot offer self permissions';
      }
      else {
        generator.next(userInstance);
        return null;
      }
    });
  }

  // Get user instance of the authenticated user
  function authUser() {
    User.findById(req.user.id)
    .then(userInstance => {
      if(userInstance) {
        generator.next(userInstance);
        return null;
      }
    });
  }

  // Get ACL
  function getAcl(offeredUserInstance) {
    ACL.findOne({
      where: {
        userId: String(req.user.id),
        toUserId: String(offeredUserInstance.getDataValue('id'))
      }
    })
    .then(aclInstance => {
      if (aclInstance) {
        // User has already been granted permissions
        res.status(400).send({ message: 'You have already granted this user permissions. If you wish to change them, please delete them first' });
        throw 'Grant-Permission - User has already granted another user permissions';
      } else {
        generator.next(aclInstance);
        return null;
      }
    });
  }

  // Get offerPermission row
  function getOfferPermission(offeredUserInstance) {
    OfferPermission.findOne({
      where: {
        userId: req.user.id,
        toUserId: String(offeredUserInstance.getDataValue('id'))
      }
    })
    .then(opInstance => {

      if (opInstance) {
        res.status(400).send({ message: 'You have already offered this user permissions. If you wish to change them, please delete them first' });
        throw 'Grant-Permission - User has already offered another user permissions';
      } else {
        generator.next(opInstance);
        return null;
      }
    });
  }
};
