const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const secret = require('../../config/secrets');

module.exports = () => {

    const options = {
        port: secret.smtpServer.port,
        host: secret.smtpServer.host,
        secure:false,
        ignoreTLS: true,
        authMethod: 'PLAIN'
    };

    const transporter = nodemailer.createTransport(smtpTransport(options));

    const mailOptions = {
        from: `<${secret.testEmail}>`,
        to: `${secret.testEmail}`,
        subject: 'Hello',
        text: 'This is a test email from nonprofit-email-service...',
        //html: '<b>Implementation of HTML is TBA</b>'
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log(`Message sent to ${secret.testEmail}!`);
    });
}
