const http = require('http');
const path = require('path');
const express = require('express');
const passport = require('passport');
const helmet = require('helmet');
const cookieSession = require('cookie-session');
const configureSequelize = require('./sequelize');
const configureWebpackDevMiddleware = require('./webpack-dev-middleware');
const configureRedis = require('./redis');
const configureSession = require('./session');
const configureIo = require('./io');

const restoreDbState = require('./restore-db-state');
const routes = require('../../routes');

const app = express();
const server = http.Server(app);

module.exports = () => {
  // Sync the db
  configureSequelize();
  // Use webpack deb middleware in development mode
  configureWebpackDevMiddleware(app);

  // Configure redis, receiving connections to client, subscriber and publisher
  const { client, subscriber, publisher } = configureRedis();

  // Configure session handling with redis, through the client connection.
  const { sessionMiddleware } = configureSession(client);

  // Configure io
  const io = configureIo(sessionMiddleware, server);

  // Configure express & passport
  require('./passport')(passport); // Configure passport strategies & serialisation
  app.use(sessionMiddleware); // Use redis as session state handler
  app.use(passport.initialize()); // Initialise passport
  app.use(passport.session()); // Use passport middleware for auth
  app.use(helmet()); // Implements various security tweaks to http response headers

  app.use(
    cookieSession({
      maxAge: 30 * 24 * 60 * 60 * 1000,
      keys: [process.env.COOKIE_SESSION]
    })
  );

  app.use('/public', express.static(path.join(__dirname, '../../../public'))); // Serve /public static files when unauth
  app.use('/dist', express.static(path.join(__dirname, '../../../dist'))); // Serve /dist static diles when auth

  // Routes
  routes(app, passport, io, { client, subscriber, publisher });

  // Start the server after correcting the database state
  restoreDbState();

  return server;
};
