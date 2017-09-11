const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const db = require('../../models');

module.exports = (passport, secret) => {
  passport.use(new GoogleStrategy({
    clientID: secret.consumerKey,
    clientSecret: secret.consumerSecret,
    callbackURL: secret.callbackURL,
  }, (token, tokenSecret, profile, done) => {
    //Check if the user has the privilege to log in
    if (!db.user.isWhiteListed(profile.emails)) {
      return done(null,false);
    }
    db.user.findOne({
      where: {
        googleId: profile.id
      }
    }).then(userExists => {
      if (userExists) {
        done(null, userExists);
      } else {
        let newUserCreated;

        db.sequelize.transaction(t => {
          return db.user.create({
            googleId: profile.id,
            token: token,
            email: profile._json.emails[0].value,
            name: profile.displayName,
            picture: profile._json.image.url
          }, { transaction: t })
            .then(newUser => {
              newUserCreated = newUser;
              return db.setting.create({ userId: newUser.id }, { transaction: t });
          });
        }).then(() => {
          done(null, newUserCreated);
        }).catch(err => {
          done(err);
        });
      }
      return null;
    }).catch(err => {
      done(err);
    });
  }));
};
