const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const asyncModule = require('async');
const csv = require('csv');
const fs = require('fs');

const inputFile = '/test-100k.csv';

module.exports = (pushItemToQueue, emailConcurrency, inputFile) => {

    const parser = csv.parse();

    const transformerOptions = {
        parallel: emailConcurrency, // Needs to obey concurrency rules based on SMTP limitations
        consume:true
    };

    const transformer = csv.transform((row, callback) => {
        // Async flow with SMTP relay server obeys concurrency rules with this stream
        pushItemToQueue(callback(null, row));

    }, transformerOptions);

    transformer.on('error', (err) => {
            // Catch & throw errs
        throw err;
    });

    // Create read stream, parse then pipe to transformer to perform async operations. Finally, release data for garbage collection.
    fs.createReadStream(`${__dirname}${inputFile}`)
        .pipe(parser)
        .pipe(transformer)
        .on('data', function() {
            // Do nothing with the data. Allow chunk to evaporate in write stream to prevent buffer overflow.
        })
        .on('end',function() {
          console.log('CSV file has been processed ...');
        });
}
