module.exports = {
  /* Helper functions for verifying authentication */
  // Check user is allowed to load SPA
  isAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  },
  // Check user accessing API route is authenticated
  apiIsAuth(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(403).send();
    }
  }
};
