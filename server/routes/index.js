const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer')({dest: 'server/controllers/list/uploads/'});
const auth = require('./auth');

const createCampaign = require('../controllers/campaign/create-campaign');
const getCampaigns = require('../controllers/campaign/get-campaigns');
const sendCampaign = require('../controllers/campaign/send-campaign');

const addSubscribers = require('../controllers/list/add-subscribers');
const importCSV = require('../controllers/list/import-csv');
const getLists = require('../controllers/list/get-lists');
const getListSubscribers = require('../controllers/list/get-list-subscribers');

const unsubscribe = require('../controllers/subscriber/unsubscribe');

const changeSettings = require('../controllers/changesettings');


const parseJson = bodyParser.json();

module.exports = (app, passport) => {

  ////////////////////
  /* AUTHENTICATION */
  ////////////////////

  auth(app, passport, isAuth);

  ////////////////////
  /*      API       */
  ////////////////////

  /* Campaigns */

  /* GET */

  // Get a list of all campaigns
  app.get('/api/campaign', isAuth, (req, res) => {
    getCampaigns(req, res);
  });

  /* POST */

  // Create new campaign
  app.post('/api/campaign', isAuth, parseJson, (req, res) => {
    createCampaign(req, res);
  });

  app.post('/api/campaign/send', isAuth, parseJson, (req, res) => {
    sendCampaign(req, res);
  });

  /* Lists */

  /* GET */

  // Send user their lists
  app.get('/api/list/manage', isAuth, (req, res) => {
    getLists(req, res);
  });
  
  // Get the subscribers of a specified list
  app.get('/api/list/subscribers', isAuth, (req, res) => {
    getListSubscribers(req, res);
  });

  /* POST */

  // Add subscribers
  app.post('/api/list/add/subscribers', isAuth, (req, res) => {
    addSubscribers(req, res);
  });

  // Import csv
  app.post('/api/list/add/csv', isAuth, multer.single('csv'), (req, res) => {
    importCSV(req, res);
  });

  /* Settings */

  // Change settings
  app.post('/api/settings', isAuth, parseJson, (req, res) => {
    changeSettings(req, res);
  });
  
  /* Subscribers */
  
  app.get('/unsubscribe/:unsubscribeKey', (req, res) => {
    unsubscribe(req, res);
  })

  ////////////////////
  /*      APP       */
  ////////////////////

  app.get('/*', isAuth, (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
  });

};

// Helper function for verifying authentication
function isAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};
