const path = require('path');
const bodyParser = require('body-parser');

module.exports = (app, passport) => {
  app.get('/login', (req, res) => {
    let strategies = {
      local:true,
    };

    if(process.env.GOOGLE_CONSUMER_KEY !== undefined){
      strategies.google = true
    }
    res.render(path.resolve('public/index.pug'), {strategies});
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

  app.post('/auth/local/login',bodyParser.urlencoded({extended:true}), function(req,res,next){
    passport.authenticate('local-login',function(err,user,info){
      if(err){
        res.status(401).json({error:err})
      }

      if(user){
        req.login(user,function(loginErr){
          if (loginErr) {
            return next(loginErr);
          }
          return res.redirect('/');
        })
      }
    })(req,res,next)
  })
};
