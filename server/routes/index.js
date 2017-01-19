const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./auth');
const parseJson = bodyParser.json();

const unsubscribe = require('../controllers/subscriber/unsubscribe');

// Permissions
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

// Analytics
const getClickthroughs = require('../controllers/analytics/get-clickthroughs');
const refresh = require('../controllers/analytics/refresh');
const open = require('../controllers/analytics/open');
const clickthrough = require('../controllers/analytics/clickthrough');

// Settings
const getSettings = require('../controllers/settings/get-settings');
const changeSettings = require('../controllers/settings/changesettings');

// Websocket notifications
const getProfile = require('../controllers/websockets/get-profile');

// Middleware
const { apiIsAuth, isAuth } = require('./middleware/auth');

// Routes
const lists = require('./lists');
const templates = require('./templates');
const campaigns = require('./campaigns');

module.exports = (app, passport, io, redis) => {

  ////////////////////
  /* AUTHENTICATION */
  ////////////////////

  auth(app, passport, isAuth);

  app.get('/logout', isAuth, (req, res) => {
    req.logout();
    res.redirect('/login');
  });

  ////////////////////
  /*      API       */
  ////////////////////

  /* Campaigns */
  campaigns(app, io, redis);

  /* Templates */
  templates(app);

  /* Lists */
  lists(app, io);

  /* Permissions */
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

  /* Settings */
  // Get boolean values designating assigned fields
  app.get('/api/settings', apiIsAuth, (req, res) => {
    getSettings(req, res);
  });
  // Post to change new settings
  app.post('/api/settings', apiIsAuth, parseJson, (req, res) => {
    changeSettings(req, res);
  });

  /* Subscribers */
  // Get to unsubscribe an email based on the unsubscribeKey parameter
  app.get('/unsubscribe/:unsubscribeKey', (req, res) => {
    unsubscribe(req, res);
  });

  ////////////////////
  /*    ANALYTICS   */
  ////////////////////

  // convenience root for dev
  app.get('/api/analytics/refresh', (req, res) => {
    refresh(req, res);
  });
  // Clickthrough
  app.get('/clickthrough', (req, res) => {
    clickthrough(req, res);
  });
  // Open/pixel tracking
  app.get('/trackopen', (req, res) => {
    open(req, res);
  });
  // temporary
  app.get('/api/analytics/clickthrough', apiIsAuth, (req, res) => {
    getClickthroughs(req, res);
  });

  ////////////////////
  /*      APP       */
  ////////////////////

  app.get('/*', isAuth, (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
    // On initial client connection, store the user's websocket info in their authenticated session
    io.on('connection', socket => {
      socket.on('login', () => {
        req.session.passport.socket = socket.id;
        req.session.save();
        getProfile(req).then(userObject => {
          socket.emit('loginResponse', userObject);
        });
      });
    });
  });

};
