const passport = require('passport');

const secrets = require('../secrets');
const db = require('../../models');
const Google = require('../passport/google');
const local = require('../passport/local')

module.exports = () => {
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
  if(typeof process.env.GOOGLE_CONSUMER_KEY !== 'undefined'){
    Google(passport, secrets.google);
  }
  local(passport)
};
