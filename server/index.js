const express = require('express');
const redis = require("redis");
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const helmet = require('helmet');

require('dotenv').config();
const restoreDbState = require('./restore-db-state');

const secret = require('./config/secrets');
const routes = require('./routes');

// Config
require('./config/passport')(passport);

const client = redis.createClient();
const subscriber = redis.createClient();  // Need to create separate connections
const publisher = redis.createClient();   // for pub-sub

client.on("error", err => console.log(`Error: ${err} - Are you running redis?`)); // eslint-disable-line

app.use(session({
  store: new RedisStore({ client }),
  secret: secret.sessionSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet()); // Implements various security tweaks to http response headers

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
    console.log(err);
  });
});
