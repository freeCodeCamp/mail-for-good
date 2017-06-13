const webpack = require('webpack');
const express = require('express');
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const helmet = require('helmet');

require('dotenv').config();
const restoreDbState = require('./restore-db-state');
const secret = require('./config/secrets');
const routes = require('./routes');

// Use bluebird over native promises. It's superior in speed and debugging.
global.Promise=require("bluebird");

// Websocket notifications
const getProfile = require('./controllers/websockets/get-profile');

// Config Webpack in dev mode
if (process.env.NODE_ENV === 'development') {
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const devWebpackConfig = require('../webpack.config.dev');
  const compiler = webpack(devWebpackConfig);

  app.use(webpackDevMiddleware(compiler, { publicPath: devWebpackConfig.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// Config refis
const redisSettings = { host: process.env.REDIS_HOST || '127.0.0.1' };
const client = redis.createClient(redisSettings);
const subscriber = redis.createClient(redisSettings);  // Need to create separate connections
const publisher = redis.createClient(redisSettings);   // for pub-sub

client.on('error', err => console.log('Error: Are you running redis? - ', err));

// Session middleware
const sessionMiddleware = session({
  store: new RedisStore({ client }),
  secret: secret.sessionSecret,
  resave: false,
  saveUninitialized: false
});

// Express middleware & passport setup
require('./config/passport')(passport);
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet()); // Implements various security tweaks to http response headers

// Config io & middleware
const io = require('socket.io')(server);
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});
io.on('connection', socket => {
  socket.request.session.passport.socket = socket.id;
  socket.request.session.save(() => {

    /**
    * Save the new socket id to the user's session stored in Redis
    * This ensures that on refresh, users still get websockets.
    */

    socket.on('login', () => {
      // Pass the user their user info for display on the frontend
      const id = socket.request.session.passport.user;
      getProfile(id).then(userObject => {
        socket.emit('loginResponse', userObject);
      });
    });

  });
});

// There are two separate directories for unauthenticated and authenticated users.
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Routes
routes(app, passport, io, { client, subscriber, publisher });

// Start the server after correcting the database state
restoreDbState();

const port = process.env.PORT || 8080;
server.listen(port, function() {
  const displayMessage = `
  ############################
  #   Mail 4 Good started    #
  ############################
  # Port: ${port}
  ############################
  `;
  console.log(displayMessage);
});

server.on('error', err => {
  console.log(err);
});
