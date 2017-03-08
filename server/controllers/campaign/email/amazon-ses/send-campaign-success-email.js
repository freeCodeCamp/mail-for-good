const AmazonEmail = require('./amazon');


module.exports = (data, ses) => {
  const fromName = `Mail for Good`;
  const emailSubject = `MfG: campaign delivered`;
  const emailBody = `Campaign: "${data.campaignName}" has been successfully delivered.\n
Duration: ${(data.durationMs/1000/60).toFixed(2)} minutes`;

  ses.sendEmail(AmazonEmail(
    { email: data.fromEmail },
    { fromEmail: data.fromEmail, fromName, emailBody, emailSubject, type: 'Plaintext' }
  ).email, (data, err) => {
    console.log("Sent campaign delivery success email")
    console.log(data);
    console.log(err);
  });
}
