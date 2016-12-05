const Handlebars = require('handlebars');

module.exports = (task, campaignInfo) => {
  // can pre-compile this to save time
  const bodyTemplate = Handlebars.compile(campaignInfo.emailBody);

  const data = { email: task.email };
  return bodyTemplate(data)
};
