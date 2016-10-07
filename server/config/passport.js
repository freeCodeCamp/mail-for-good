const secrets = require('./secrets');
const User = require('../models').user;

module.exports = (passport) => {
  const db = require('../models');
  const Google = require('./passport/google');

  const sequelize = db.sequelize;

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {

    User.findById(id).then(user => {
      done(null, user);
    }).catch(err => {
      if (err)
        throw err;
      }
    )
  });
  ///////////////////////////////
  /* AUTHENTICATION STRATEGIES */
  ///////////////////////////////
  Google(passport, secrets.google);
};
