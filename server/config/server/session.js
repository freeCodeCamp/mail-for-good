const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const secret = require('../secrets');

module.exports = client => {
  // Session middleware
  const sessionMiddleware = session({
    store: new RedisStore({ client }),
    secret: secret.sessionSecret,
    resave: false,
    saveUninitialized: false
  });

  return { sessionMiddleware };
};
