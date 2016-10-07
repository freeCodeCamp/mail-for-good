const express = require('express');
const session = require('express-session')
const passport = require('passport');
const Sequelize = require('sequelize');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const secret = require('./config/secrets');
const routes = require('./routes');

const app = express();

// Config
require('./config/passport')(passport);

app.use(session({secret: secret.sessionSecret, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

// Use dirs appropriately, with a separation of concerns for the public & dist dirs
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// Routes
routes(app, passport);

// Server
const port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log(`Email service live on port ${port}`);
});
