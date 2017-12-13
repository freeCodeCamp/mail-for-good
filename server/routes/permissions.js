const bodyParser = require('body-parser');
const parseJson = bodyParser.json();

// Permissions controllers
const getGrantedPermissions = require('../controllers/permissions/get-granted-permissions');
const grantPermissions = require('../controllers/permissions/grant-permission');
const deleteGrantedPermissions = require('../controllers/permissions/delete-granted-permissions');

const getActivePermissions = require('../controllers/permissions/get-active-permissions');
const deleteActivePermissions = require('../controllers/permissions/delete-active-permissions');

const getReceivedPermissionOffers = require('../controllers/permissions/get-received-permission-offers');
const acceptPermissionOffer = require('../controllers/permissions/accept-permission-offer');
const rejectPermissionOffer = require('../controllers/permissions/reject-permission-offers');

const getGrantOfferedPermissions = require('../controllers/permissions/get-grant-offered-permissions');
const deleteGrantOfferedPermissions = require('../controllers/permissions/delete-grant-offered-permissions');

// Middleware
const { apiIsAuth } = require('./middleware/auth');

module.exports = function(app) {
  // Get granted permissions (i.e. permissions you have granted another user)
  app.get('/api/permissions', apiIsAuth, (req, res) => {
    getGrantedPermissions(req, res);
  });
  // Post to offer another user a set of permissions
  app.post('/api/permissions', apiIsAuth, parseJson, (req, res) => {
    grantPermissions(req, res);
  });
  // Delete granted permissions, removes item(s) from the ACL
  app.delete('/api/permissions', apiIsAuth, parseJson, (req, res) => {
    deleteGrantedPermissions(req, res);
  });

  // Get active permissions (grantee -> granter)
  app.get('/api/active-permissions', apiIsAuth, (req, res) => {
    getActivePermissions(req, res);
  });
  // Delete active permissions, removes item(s) from the ACL
  app.delete('/api/active-permissions', apiIsAuth, parseJson, (req, res) => {
    deleteActivePermissions(req, res);
  });

  // Get received permission offers
  app.get('/api/received-permissions', apiIsAuth, (req, res) => {
    getReceivedPermissionOffers(req, res);
  });
  // Post to accept permission offers
  app.post('/api/received-permissions', apiIsAuth, parseJson, (req, res) => {
    acceptPermissionOffer(req, res);
  });
  // Delete to reject permission offers
  app.delete('/api/received-permissions', apiIsAuth, parseJson, (req, res) => {
    rejectPermissionOffer(req, res);
  });

  // Get offered permissions (granter -> grantee)
  app.get('/api/grant-offered-permissions', apiIsAuth, (req, res) => {
    getGrantOfferedPermissions(req, res);
  });
  // Delete offered permissions, removes item(s) from the ACL
  app.delete('/api/grant-offered-permissions', apiIsAuth, parseJson, (req, res) => {
    deleteGrantOfferedPermissions(req, res);
  });
};
