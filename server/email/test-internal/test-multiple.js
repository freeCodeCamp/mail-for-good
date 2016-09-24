const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const asyncModule = require('async');
const parse = require('csv-parse');

if (process.env.RUN_ALONE) {
    require('dotenv').config();
    multipleTest();
} else {
    module.exports = multipleTest;
}

function multipleTest() {
    const secret = require('../../config/secrets');

    /* Constants */
    const options = {
        port: secret.smtpServer.port,
        host: secret.smtpServer.host,
        secure:false,
        ignoreTLS: true,
        authMethod: 'PLAIN'
    };

    const transporter = nodemailer.createTransport(smtpTransport(options));

    /*
    var output = [];
    // Create the parser
    var parser = parse({delimiter: ':'});
    // Use the writable stream api
    parser.on('readable', function(){
      while(record = parser.read()){
        output.push(record);
      }
    });
    // Catch any error
    parser.on('error', function(err){
      console.log(err.message);
    });
    // When we are done, test that the parsed output matched what expected
    parser.on('finish', function(){

    });
    // Close the readable stream
    parser.end();
    */

    /*
        Pool emails using aync queues
        -   asyncModule.queue accepts task (email data to be sent) & a callback function that signifies completion. When an email is successfully sent, callback is invoked.
            Second arg is the no. of emails to be processed concurrently. This will be rate limited in accordance with the relay server's response.
    */
    let emailConcurrency = 2; // Will need to be changed algorithmically using the relay server response.

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

    const test = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];

    q.push([...test], (err) => {
        if (err) throw err;
    });

    // assign a callback
    q.drain = function() {
        console.log('all items have been processed');
    };
}
