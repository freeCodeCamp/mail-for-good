const Google = require('./passport/google');

const User = require('../db/models').User;
const secrets = require('./secrets');

module.exports = (passport) => {
    passport.serializeUser(function(user,done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
    ///////////////////////////////
    /* AUTHENTICATION STRATEGIES */
    ///////////////////////////////
    Google(passport, User, secrets.google);
};
