const Handlebars = require('handlebars');

module.exports = (task, campaignInfo) => {
  // can pre-compile this to save time
  const bodyTemplate = Handlebars.compile(campaignInfo.emailBody);

  let data = task.additionalData;
  data.email = task.email;

  return bodyTemplate(data)
};
