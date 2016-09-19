/*
  Starts an SMTP server. This server is used for debugging purposes. Emails can be sent to this server as opposed to relay services
  that charge a fee for using their internal test service.

  This test server is not secure and should not be used for any purpose other than debugging.

  See: https://github.com/andris9/smtp-server
*/

const SMTPServer = require('smtp-server').SMTPServer;
const secret = require ('../../config/secrets.js');

// Config options & pass to server
const smtpServerOptions = {
    logger:true, // Log to console
    authOptional: true // Authentication is not required
};
const server = new SMTPServer(smtpServerOptions);

// Start the server //
const port = secret.smtpServer.port;
const host = secret.smtpServer.host;

server.listen(port, host);
