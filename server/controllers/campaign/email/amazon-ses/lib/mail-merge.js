/**
 * @description Converts {{variables}} in the email body to their equivalent in the db
 * @param {object} task - The email to create
 * @param {object} campaignInfo - Information about this campaign
 * @return {string} HTML with {{variables}} replaced by what they represent. E.g., {{cat}} may become 'Garfield'
 */

const Handlebars = require('handlebars');

module.exports = (task, campaignInfo) => {
  // can pre-compile this to save time
  const bodyTemplate = Handlebars.compile(campaignInfo.emailBody);

  let data = task.additionalData;
  data.email = task.email;

  return bodyTemplate(data);
};
