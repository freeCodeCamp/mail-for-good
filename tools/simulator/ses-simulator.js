const http = require('http');
const express = require('express');
const Sequelize = require('sequelize');

// Limitations:
// - Assumes that batch email sending has not been used - only 'Destination.ToAddresses.member.1' is recorded

const app = express();
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());

// Track received emails in an sqlite database
// This provides a bit more flexibility than dumping to csv, as we can later
// implement an SQS feedback simulator that uses the stored messageIds.
const sequelize = new Sequelize('database', 'username', 'password', {
  dialect: 'sqlite',
  storage: './tools/simulator/simulator.db',
  logging: false
});

const Email = sequelize.define('email', {
  messageId: Sequelize.STRING,
  body: Sequelize.STRING,
  subject: Sequelize.STRING,
  destination: Sequelize.STRING,
  destinationEmail: Sequelize.STRING,
  source: Sequelize.STRING
});

// Associate emails with a session id that is incremented each time we run this script
const Session = sequelize.define('session', { });
Session.hasMany(Email);
Email.belongsTo(Session);

const xml = `
<?xml version="1.0" ?>
<SendEmailResponse xmlns="https://email.amazonaws.com/doc/2010-03-31/">
  <SendEmailResult>
    <MessageId>000001271b15238a-fd3ae762-2563-11df-8cd4-6d4e828a9ae8-000000</MessageId>
  </SendEmailResult>
  <ResponseMetadata>
    <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
  </ResponseMetadata>
</SendEmailResponse>
`;

let sessionId;

let numReceived = 0;
app.use((req, res) => {
  Email.create({
    body: req.body['Message.Body.Text.Data'],
    subject: req.body['Message.Subject.Data'],
    destination: req.body['Destination.ToAddresses.member.1'],
    source: req.body['Source'],
    sessionId
  });

  numReceived++;

  // Mock latency
  setTimeout(() => {
    res.statusCode = 200;
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(xml);
  }, 150);
});

(function printNumReceivedPerSecond() {
  setTimeout(() => {
    if (numReceived !== 0) {
      console.log(`${Math.ceil(numReceived)} requests received in 1s`); // eslint-disable-line
      numReceived = 0;
    }

    printNumReceivedPerSecond();
  }, 1000);
})();

const port = 9999;
const host = 'localhost';
const server = http.createServer(app);

sequelize
  .sync({ force: false })
  .then(() => {
    Session
      .create({ }, { raw: true })
      .then(session => {
        sessionId = session.id;
        console.log(`SES simulator connected to database. Session id: ${session.id}`); // eslint-disable-line
        server.listen(port, host, () => { console.log(`Amazon test server running at http://${host}:${port}`); }); // eslint-disable-line
      });
  }, err => {
    console.log('An error occurred while creating the table:', err); // eslint-disable-line
});
