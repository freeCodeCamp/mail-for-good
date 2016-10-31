const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer')({dest: 'server/controllers/list/uploads/'});
const auth = require('./auth');

const createCampaign = require('../controllers/campaign/create-campaign');
const getCampaigns = require('../controllers/campaign/get-campaigns');
const sendCampaign = require('../controllers/campaign/send-campaign');
const deleteCampaigns = require('../controllers/campaign/delete-campaigns');

const addSubscribers = require('../controllers/list/add-subscribers');
const importCSV = require('../controllers/list/import-csv');
const getLists = require('../controllers/list/get-lists');
const getListSubscribers = require('../controllers/list/get-list-subscribers');

const unsubscribe = require('../controllers/subscriber/unsubscribe');

const refresh = require('../controllers/analytics/refresh');
const open = require('../controllers/analytics/open');
const clickthrough = require('../controllers/analytics/clickthrough');
const getClickthroughs = require('../controllers/analytics/get-clickthroughs');
const getSentEmails = require('../controllers/analytics/get-sent-emails');

const getProfile = require('../controllers/websockets/get-profile');

const changeSettings = require('../controllers/changesettings');

const parseJson = bodyParser.json();

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

  /* GET */

  // Get a list of all campaigns
  app.get('/api/campaign', apiIsAuth, (req, res) => {
    getCampaigns(req, res);
  });

  /* POST */

  // Create new campaign
  app.post('/api/campaign', apiIsAuth, parseJson, (req, res) => {
    createCampaign(req, res);
  });

  // Send campaign
  app.post('/api/campaign/send', apiIsAuth, parseJson, (req, res) => {
    sendCampaign(req, res, io);
  });

  /* DELETE */

  app.delete('/api/campaign', apiIsAuth, parseJson, (req, res) => {
    deleteCampaigns(req, res);
  });

  /* Lists */

  /* GET */

  // Send user their lists
  app.get('/api/list/manage', apiIsAuth, (req, res) => {
    getLists(req, res);
  });

  // Get the subscribers of a specified list
  app.get('/api/list/subscribers', apiIsAuth, (req, res) => {
    getListSubscribers(req, res);
  });

  /* POST */

  // Add subscribers
  app.post('/api/list/add/subscribers', apiIsAuth, (req, res) => {
    addSubscribers(req, res);
  });

  // Import csv
  app.post('/api/list/add/csv', apiIsAuth, multer.single('csv'), (req, res) => {
    importCSV(req, res, io);
  });

  /* Settings */

  // Change settings
  app.post('/api/settings', apiIsAuth, parseJson, (req, res) => {
    changeSettings(req, res);
  });

  /* Subscribers */

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
  app.get('/open', (req, res) => {
    open(req, res);
  })

  // temporary
  app.get('/api/analytics/clickthrough', apiIsAuth, (req, res) => {
    getClickthroughs(req, res);
  });

  // temporary
  app.get('/api/analytics/get-sent-emails', (req, res) => {
    getSentEmails(req, res);
  });

  ////////////////////
  /*      APP       */
  ////////////////////

  app.get('/*', isAuth, (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));

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

// Helper function for verifying authentication
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
}

function apiIsAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(403).send();
  }
}
