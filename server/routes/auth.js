const path = require('path');

module.exports = (app, passport) => {
  app.get('/login', (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        "Pragma": 'no-cache',
        'Expires': 0
      };
      res.sendFile(path.resolve('public/index.html'), { headers });
    }
  });

  // Redirect user to Google for authentication. When complete, Google will return the user to /auth/google/return
  // Ref https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
  }));

  // Verify authentication with Passport. Send to /
  app.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/', //TODO: Change this to an authenticated url e.g. /a or /account. Can also redirect simply to / using a separate workflow
    failureRedirect: '/login'
  }));
};
