const path = require('path');

const auth = require('./auth');

const changeSettings = require('../controllers/changesettings');
const addSubscribers = require('../controllers/addsubscribers');


module.exports = (app, passport) => {

    ////////////////////
    /* AUTHENTICATION */
    ////////////////////

    auth(app, passport, isAuth);

    /////////
    /* APP */
    /////////

    app.get('/', isAuth, (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });

    ////////////////////
    /*      API       */
    ////////////////////

    /* Settings */

    // Change settings
    app.post('/api/settings', (req, res) => {
      changeSettings(req, res);
    });

    /* Subscribers */

    // Add multiple subscribers
    app.post('/api/subscribers', (req, res) => {
      addSubscribers(req, res);
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
