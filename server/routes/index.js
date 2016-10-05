const path = require('path');
const multer = require('multer')({ dest: 'server/controllers/list/uploads/' });

const auth = require('./auth');

const changeSettings = require('../controllers/changesettings');

const addSubscribers = require('../controllers/list/add-subscribers');
const importCSV = require('../controllers/list/import-csv');
const getLists = require('../controllers/list/get-lists');


module.exports = (app, passport) => {

    ////////////////////
    /* AUTHENTICATION */
    ////////////////////

    auth(app, passport, isAuth);

    ////////////////////
    /*      API       */
    ////////////////////

    /* Settings */

    // Change settings
    app.post('/api/settings', isAuth, (req, res) => {
      changeSettings(req, res);
    });

    /* Subscribers */

    /* GET */

    // Send user their lists
    app.get('/api/list/manage', isAuth, (req, res) => {
      getLists(req, res);
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

    /////////
    /* APP */
    /////////

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
