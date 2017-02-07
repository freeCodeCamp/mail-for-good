const http = require('http');
const express = require('express');
const argv = require('yargs')
  .usage('\nUsage: node index.js <command> [options]')
  .example('Use default setting:', 'node ses-simulator.js')
  .example('Show no. req per minute:', 'node ses-simulator.js -i 60000')
  .example('Change port:', 'node ses-simulator.js -p 3000')
  .example('Generate ~1 throttling res per 1k req', 'node ses-simulator.js -e 0.1')
  // Host
  .alias('h', 'host')
  .string('h')
  .nargs('h', 1)
  .describe('h', 'Set the hostname')
  .default('h', 'localhost')
  // Port
  .alias('p', 'port')
  .number('p')
  .nargs('p', 1)
  .describe('p', 'Set the port')
  .default('p', 9999)
  // Interval
  .alias('i', 'interval')
  .number('i')
  .nargs('i', 1)
  .describe('i', 'Interval between req reports (ms)')
  .default('i', 1000)
  // Validate
  .alias('v', 'validate')
  .boolean('v')
  .nargs('v', 1)
  .describe('v', 'Should validate emails')
  .default('v', false)
  // Error
  .alias('e', 'error')
  .number('e')
  .nargs('e', 1)
  .describe('e', '% chance of throttling error')
  .default('e', 0)
  // Other
  .help('help')
  .epilog('For more info visit: https://github.com/AndrewGHC/node-amazon-ses-simulator')
  .argv;

const app = express();
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('body-parser').json());

const {
  host,
  port,
  interval,
  validate,
  error
} = argv;

const xmlSuccess = `
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

const xmlError = `
<?xml version="1.0" ?>
<ErrorResponse xmlns="http://cloudformation.amazonaws.com/doc/2010-05-15/">
  <Error>
    <Type>Sender</Type>
    <Code>Throttling</Code>
    <Message>Rate exceeded</Message>
  </Error>
  <RequestId>fd3ae762-2563-11df-8cd4-6d4e828a9ae8</RequestId>
</ErrorResponse>
`;

function emailIsValid(body) {
  // @params body = req.body
  // Emails must contain a valid source, destination, subject and body
  const emailBody = body['Message.Body.Text.Data'];
  const emailSubject = body['Message.Subject.Data'];
  const destination = body['Destination.ToAddresses.member.1'];
  const source = body['Source'];
  const action = body['Action'];
  // Source field exists
  if (!emailBody === undefined) {
    throw new Error('Message body text data is undefined');
  }
  if (!emailSubject === undefined) {
    throw new Error('Message subject data is undefined');
  }
  if (!destination === undefined) {
    throw new Error('No destination email defined');
  }
  if (!source) {
    throw new Error('No source email defined');
  }
  if (!action && action !== 'SendEmail') {
    throw new Error('Incorrect action specified');
  }
}

function emailToSend() {
  const shouldSendError = (Math.ceil(Math.random() * 100)) <= error ? true : false;
  if (shouldSendError) {
    return { email: xmlError, status: 400 };
  }
  else {
    return { email: xmlSuccess, status: 200 };
  }
}

let numReceived = 0;
// Middleware that will blindly respond to requests
app.use((req, res) => {

  numReceived++;

  // Validate email
  if (validate) {
    emailIsValid(req.body);
  }

  // Mock latency
  const numberBetweenOneAndOneHundredFifty = Math.floor((Math.random() * 100)) + 50;
  setTimeout(() => {
    // See https://docs.aws.amazon.com/ses/latest/DeveloperGuide/api-error-codes.html
    const { email, status } = emailToSend();
    res.statusCode = status;
    res.writeHead(status, { 'Content-Type': 'text/xml' });
    res.end(email);
  }, numberBetweenOneAndOneHundredFifty);
});

(function printNumReceived() {
  setTimeout(() => {
    console.log(`${Math.ceil(numReceived)} requests received in last ${interval / 1000} second(s)`); // eslint-disable-line
    numReceived = 0;
    printNumReceived();
  }, interval);
})();

const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`\n##########################`);
  console.log(`## Amazon SES Simulator ##`);
  console.log(`##########################\n`);
  console.log(`Running at http://${host}:${port}\n`);
});
