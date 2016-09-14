const changeSettings = require('../controllers/changesettings');


module.exports = (app, passport) => {
    ////////////////////
    /* AUTHENTICATION */
    ////////////////////

    // Redirect user to Google for authentication. When complete, Google will return the user to /auth/google/return
    // Ref https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }));

    // Verify authentication with Passport. Send to /
    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/success', //TODO: Change this to an authenticated url e.g. /a or /account. Can also redirect simply to / using a separate workflow
        failureRedirect: '/login'
      })
    );

    ////////////////////
    /*      API       */
    ////////////////////

    /* Settings */
    
    // Change settings
    app.post('/api/settings', (req, res) => {
      changeSettings(req, res);
    })
};

// Helper function for verifying authentication
function isAuth(req, res) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
};
