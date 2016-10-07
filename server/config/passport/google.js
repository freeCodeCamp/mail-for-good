const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../../models').user;

module.exports = (passport, secret) => {

  passport.use(new GoogleStrategy({
    clientID: secret.consumerKey,
    clientSecret: secret.consumerSecret,
    callbackURL: secret.callbackURL
  }, (token, tokenSecret, profile, done) => {

    User.findOne({
      where: {
        googleId: profile.id
      }
    }).then(userExists => {
      if (userExists) {
        done(null, userExists);
      } else {
        User.create({googleId: profile.id, token: token, email: profile._json.emails[0].value, name: profile.displayName, picture: profile._json.picture}).then(newUser => {
          done(null, newUser);
        });
      }

    }).catch(err => {
      throw err;
    });

  }))
}
