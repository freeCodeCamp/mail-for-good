require('dotenv').config();

const configureServer = require('./config/server');

// Use bluebird over native promises.
global.Promise=require('bluebird');

const server = configureServer();

const PORT = process.env.PORT || 8080;
server.listen(PORT, function() {
  const displayMessage = `
  ############################
  #   Mail 4 Good started    #
  ############################
  # Port: ${PORT}
  ############################
  `;

  console.log(displayMessage);
});
