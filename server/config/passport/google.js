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
                User.create({
                    googleId: profile.id,
                    token: token,
                    email: profile._json.emails[0].value,
                    name: profile.displayName,
                    picture: profile._json.picture
                }).then(newUser => {
                    done(null, newUser);
                });
            }

        }).catch(err => {
            throw err;
        });

    }))
}



/*User.findOne({
            where: { google: profile.id }
        }).then(existingUser) => {
            console.log(exists)
        }

    }))*/


/*(err, userExists) => {
            // Search will proceed in the following manner:
            //  1. If there was an error, return the error
            //  2. If found, serialise user
            //  3. If not found, create and serialise a new user

            if (err) {
                done(err);
            } else if (userExists) {
                done(null, userExists);
            } else {
                let newGoogleUser = new User();

                newGoogleUser.google.id = profile.id;
                newGoogleUser.google.token = token;

                newGoogleUser.google.email = profile._json.emails[0].value;
                newGoogleUser.google.name = profile.displayName;
                newGoogleUser.google.picture = profile._json.picture;

                return newGoogleUser.save(err => {
                    if (err) throw err;
                    done(null, newGoogleUser);
                });

            }

        });

    }));
};
*/
