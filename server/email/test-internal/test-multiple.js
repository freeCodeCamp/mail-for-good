const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const asyncModule = require('async');

const csvParseModule = require('../lib/streams/csv');

if (process.env.RUN_ALONE) {
    require('dotenv').config();
    multipleTest();
} else {
    module.exports = multipleTest;
}

function multipleTest() {

    /*
        Put simply this module:
        -   Opens a stream to a data source containing, at the least, a recipient email address on each line
        -   Sends a given number of emails to an asynchronous process that sends emails to an SMTP relay server and requests more emails when it's finished

        In more depth:
        -   A stream is opened to a data source (currently a CSV file) containing a TO email, SUBJECT and MESSAGE (e.g. [TO, SUBJECT, MESSAGE]) TODO: Delete message, it's redundant
        -   The data source is parsed asynchronously with lines being parsed concurrently, the rate of concurrency is determined by the SMTP relay server's imposed limitations
        -   Emails from the readable stream are sent to an asynchronous queue
        -   The concurrency of the async queue is adjusted and rate limited by the relay server's response & limitations
        -   When an email is sent (the relay server provides confirmation) another email is queued in its place
        -   Finally, when all emails have been sent the process ends (invoking .drain callback)
    */

    // Set up constants for this module //

    const secret = require('../../config/secrets');

    const options = {
        port: secret.smtpServer.port,
        host: secret.smtpServer.host,
        secure:false,
        ignoreTLS: true,
        authMethod: 'PLAIN'
    };

    const transporter = nodemailer.createTransport(smtpTransport(options));

    let emailConcurrency = 100; // Will need to be changed algorithmically using the relay server response.

    /*
        Pool emails using aync queues
        -   asyncModule.queue accepts task (email data to be sent) & a callback function that signifies completion. When an email is successfully sent, callback is invoked.
            Second arg is the no. of emails to be processed concurrently. This will be rate limited in accordance with the relay server's response.
    */

    const q = asyncModule.queue((task, callback) => {

        const mailOptions = {
            from: `<${secret.testEmail}>`,
            to: `${secret.testEmail}`,
            subject: 'Hello',
            text: 'This is a test email from nonprofit-email-service...',
            //html: '<b>Implementation of HTML is TBA</b>'
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                return console.log(err);
            }
            console.log(`Message sent to ${secret.testEmail}!`);
            callback(); // Accept new email from pool
        });

    }, emailConcurrency);

    // Async queue complete
    q.drain = () => {
        console.log('[async] All emails have been processed');
    };

    // Takes an email which is pushed to the queue, and a callback which should tell the stream to continue
    const pushItemToQueue = (email, callback) => {
        q.push([email], err => {
            if (err) throw err;
            callback;
        });
    };

    // Modules for parsing streams can now be called
    csvParseModule(pushItemToQueue, emailConcurrency, '/test-100k.csv');

}
