const express = require('express');
const session = require('express-session')
const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const secret = require('./config/secrets');
const routes = require('./routes');

const app = express();

// Connect to mongo
mongoose.connect(secret.mongo);

/* LINE BELOW SENDS A TEST EMAIL, THIS COMMENT IS TEMPORARY */
// require('./email/test-internal/test-single.js')();

// Config
require('./config/passport')(passport);

app.use(session({
    secret: secret.sessionSecret,
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, '../public')));

// Routes
routes(app, passport);

// Server
const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Email service live on port ${port}`);
});
