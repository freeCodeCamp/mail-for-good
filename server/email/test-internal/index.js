/*
  Starts an SMTP server. This server is used for debugging purposes. Emails can be sent to this server as opposed to relay services
  that charge a fee for using their internal test service.

    See: https://github.com/andris9/smtp-server

    options defines the behavior of the server
        options.secure if true, the connection will use TLS. The default is false. If the server doesn't start in TLS mode, it is still possible to upgrade clear text socket to TLS socket with the STARTTLS command (unless you disable support for it). If secure is true, additional tls options for tls.createServer can be added directly onto this options object.
        options.name optional hostname of the server, used for identifying to the client (defaults to os.hostname())
        options.banner optional greeting message. This message is appended to the default ESMTP response.
        options.size optional maximum allowed message size in bytes, see details here
        options.authMethods optional array of allowed authentication methods, defaults to ['PLAIN', 'LOGIN']. Only the methods listed in this array are allowed, so if you set it to ['XOAUTH2'] then PLAIN and LOGIN are not available. Use ['PLAIN', 'LOGIN', 'XOAUTH2'] to allow all three. Authentication is only allowed in secure mode (either the server is started with secure: true option or STARTTLS command is used)
        options.authOptional allow authentication, but do not require it
        options.disabledCommands optional array of disabled commands (see all supported commands here). For example if you want to disable authentication, use ['AUTH'] as this value. If you want to allow authentication in clear text, set it to ['STARTTLS'].
        options.hideSTARTTLS optional boolean, if set to true then allow using STARTTLS but do not advertise or require it. It only makes sense when creating integration test servers for testing the scenario where you want to try STARTTLS even when it is not advertised
        options.hidePIPELINING optional boolean, if set to true then does not show PIPELINING in feature list
        options.hide8BITMIME optional boolean, if set to true then does not show 8BITMIME in features list
        options.hideSMTPUTF8 optional boolean, if set to true then does not show SMTPUTF8 in features list
        options.allowInsecureAuth optional boolean, if set to true allows authentication even if connection is not secured first
        options.disableReverseLookup optional boolean, if set to true then does not try to reverse resolve client hostname
        options.sniOptions optional Map or an object of TLS options for SNI where servername is the key. Overrided by SNICallback.
        options.logger optional bunyan compatible logger instance. If set to true then logs to console. If value is not set or is false then nothing is logged
        options.maxClients sets the maximum number of concurrently connected clients, defaults to Infinity
        options.useProxy boolean, if set to true expects to be behind a proxy that emits a PROXY header (version 1 only)
        options.useXClient boolean, if set to true, enables usage of XCLIENT extension to override connection properties. See session.xClient (Map object) for the details provided by the client
        options.useXForward boolean, if set to true, enables usage of XFORWARD extension. See session.xForward (Map object) for the details provided by the client
        options.lmtp boolean, if set to true use LMTP protocol instead of SMTP
        options.socketTimeout how many milliseconds of inactivity to allow before disconnecting the client (defaults to 1 minute)
        options.closeTimeout how many millisceonds to wait before disconnecting pending connections once server.close() has been called (defaults to 30 seconds)
        options.onAuth is the callback to handle authentications (see details here)
        options.onConnect is the callback to handle the client connection. (see details here)
        options.onMailFrom is the callback to validate MAIL FROM commands (see details here)
        options.onRcptTo is the callback to validate RCPT TO commands (see details here)
        options.onData is the callback to handle incoming messages (see details here)
        options.onClose is the callback that informs about closed client connection



*/

const SMTPServer = require('smtp-server').SMTPServer;

const smtpServerOptions = {
    logger:true
};

const server = new SMTPServer(smtpServerOptions);

const port = 2025;
const host = '127.0.0.1';

server.listen(port, host);
