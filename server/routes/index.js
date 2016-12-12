const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer')({dest: 'server/controllers/list/uploads/'});
const auth = require('./auth');
const parseJson = bodyParser.json();

// Campaigns
const getCampaigns = require('../controllers/campaign/get-campaigns');
const createCampaign = require('../controllers/campaign/create-campaign');
const deleteCampaigns = require('../controllers/campaign/delete-campaigns');

// Send campaign
const sendCampaign = require('../controllers/campaign/send-campaign');
const sendTestEmail = require('../controllers/campaign/email/amazon-ses/send-test');

// Templates
const getTemplates = require('../controllers/template/get-templates');
const createTemplate = require('../controllers/template/create-template');
const deleteTemplates = require('../controllers/template/delete-templates');

// Lists
const getLists = require('../controllers/list/get-lists');
const getListSubscribers = require('../controllers/list/get-list-subscribers');
const exportListSubscribersCSV = require('../controllers/list/export-list-subscribers-csv');
const addSubscribers = require('../controllers/list/add-subscribers');
const importCSV = require('../controllers/list/import-csv');
const subscribeToList = require('../controllers/list/subscribe');
const deleteSubscribers = require('../controllers/list/delete-subscribers');
const deleteLists = require('../controllers/list/delete-lists');
const unsubscribe = require('../controllers/subscriber/unsubscribe');

// Permissions
const offerPermission = require('../controllers/permissions/offer-permission');

const getActivePermissions = require('../controllers/permissions/get-active-permissions');

const getReceivedPermissionOffers = require('../controllers/permissions/get-received-permission-offers');
const acceptPermissionOffer = require('../controllers/permissions/accept-permission-offer');
const rejectPermissionOffer = require('../controllers/permissions/reject-permission-offers');

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

module.exports = (app, passport, io) => {

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
  // Get a list of all campaigns
  app.get('/api/campaign', apiIsAuth, (req, res) => {
    getCampaigns(req, res);
  });
  // Post new campaign
  app.post('/api/campaign', apiIsAuth, parseJson, (req, res) => {
    createCampaign(req, res);
  });
  // Delete campaign(s)
  app.delete('/api/campaign', apiIsAuth, parseJson, (req, res) => {
    deleteCampaigns(req, res);
  });

  /* Send */
  // Post to send campaign
  app.post('/api/send', apiIsAuth, parseJson, (req, res) => {
    sendCampaign(req, res, io);
  });
  // Post to send a test email
  app.post('/api/test', apiIsAuth, parseJson, (req, res) => {
    sendTestEmail(req, res);
  });

  /* Templates */
  // Get a list of all templates
  app.get('/api/template', apiIsAuth, (req, res) => {
    getTemplates(req, res);
  });
  // Post a new template
  app.post('/api/template', apiIsAuth, parseJson, (req, res) => {
    createTemplate(req, res);
  });
  // Delete template(s)
  app.delete('/api/template', apiIsAuth, parseJson, (req, res) => {
    deleteTemplates(req, res);
  });

  /* Lists */
  // Get all lists
  app.get('/api/list/manage', apiIsAuth, (req, res) => {
    getLists(req, res);
  });
  // Get all subscribers of a list
  app.get('/api/list/subscribers', apiIsAuth, parseJson, (req, res) => {
    getListSubscribers(req, res);
  });
  // Get a single email using the list subscription key
  app.get('/api/list/subscribe', (req, res) => {
    subscribeToList(req, res);
  });
  // temp route for testing csv export of list subscribers
  app.get('/api/list/subscribers/csv', apiIsAuth, (req, res) => {
    exportListSubscribersCSV(req, res);
  });

  // Post new subscribers
  app.post('/api/list/add/subscribers', apiIsAuth, (req, res) => {
    addSubscribers(req, res);
  });
  // Post new list via csv import
  app.post('/api/list/add/csv', apiIsAuth, multer.single('csv'), (req, res) => {
    importCSV(req, res, io);
  });

  // Delete subscribers
  app.delete('/api/list/subscribers', apiIsAuth, parseJson, (req, res) => {
    deleteSubscribers(req, res);
  });
  // Delete lists
  app.delete('/api/list/manage', apiIsAuth, parseJson, (req, res) => {
    deleteLists(req, res);
  });

  /* Permissions */
  // Post to change new settings
  app.post('/api/permissions', apiIsAuth, parseJson, (req, res) => {
    offerPermission(req, res);
  });

  app.get('/api/active-permissions', apiIsAuth, (req, res) => {
    getActivePermissions(req, res);
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

/* Helper functions for verifying authentication */
// Check user is allowed to load SPA
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}
// Check user accessing API route is authenticated
function apiIsAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(403).send();
  }
}
