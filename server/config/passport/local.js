const LocalStrategy  = require('passport-local').Strategy;
const db = require('../../models');

module.exports = (passport) => {
  passport.use('local-login',new LocalStrategy(strategyOptions ,authenticationProcess))
};

const strategyOptions = {
  usernameField:'email',
  passwordField:'password'
}

const authenticationProcess = (email,password,done) => {
  db.user.findOne({
    where: {
      email: email
    }
  }).then( user => {
    if(user === null){
      done('No account found',false)
    }else{
      db.user.checkPassword(password,user.password)
      .then((isValid) => {
        if(isValid === true){
          done(null,user)
        }else{
          done('Wrong email/password',false);
        }
      }).catch((error) => {
        if(user && user.password === null){
          done('An account exists but doesn\'t log via a password',false)
        }
      })
    }
  })
}
