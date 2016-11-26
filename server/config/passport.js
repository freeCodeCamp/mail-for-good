const secrets = require('./secrets');
const db = require('../models');
const Google = require('./passport/google');

module.exports = (passport) => {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    db.user.findById(id).then(user => {
      done(null, user);
      return null;
    }).catch(err => {
      if (err) { throw err; }
      }
    );
  });
  ///////////////////////////////
  /* AUTHENTICATION STRATEGIES */
  ///////////////////////////////
  Google(passport, secrets.google);
};
