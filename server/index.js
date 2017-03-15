const express = require('express');
const redis = require("redis");
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

// Websocket notifications
const getProfile = require('./controllers/websockets/get-profile');

// Config
require('./config/passport')(passport);

const redisSettings = { host: process.env.REDIS_HOST || '127.0.0.1' };
const client = redis.createClient(redisSettings);
const subscriber = redis.createClient(redisSettings);  // Need to create separate connections
const publisher = redis.createClient(redisSettings);   // for pub-sub

client.on("error", err => console.log(`Error: ${err} - Are you running redis?`)); // eslint-disable-line

// Session middleware
const sessionMiddleware = session({
  store: new RedisStore({ client }),
  secret: secret.sessionSecret,
  resave: true,
  saveUninitialized: true
});

// Express middleware
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
  // console.log(socket.request.session);
  // console.log(req);
  socket.request.session.passport.socket = socket.id;
  socket.request.session.save(() => {

    socket.on('login', () => {
      const id = socket.request.session.passport.user;
      getProfile(id).then(userObject => {
        socket.emit('loginResponse', userObject);
      });
    });
    console.log(socket.request.session.passport.socket, 'RELOADED');

  });
});

// Use dirs appropriately, with a separation of concerns for the public & dist dirs
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Routes
routes(app, passport, io, { client, subscriber, publisher });

// Start the server after correcting the database state
restoreDbState().then(() => {
  const port = process.env.PORT || 8080;
  server.listen(port, function() {
    console.log(`Email service live on port ${port}`); // eslint-disable-line
  });

  server.on('error', err => {
    console.log(err); // eslint-disable-line
  });
});
