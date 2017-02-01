const bodyParser = require('body-parser');
const parseJson = bodyParser.json();
const cookieParser = require('cookie-parser')();

// Campaign controllers
const getCampaigns = require('../controllers/campaign/get-campaigns');
const createCampaign = require('../controllers/campaign/create-campaign');
const deleteCampaigns = require('../controllers/campaign/delete-campaigns');
const exportSentUnsentCSV = require('../controllers/campaign/export-sent-unsent-csv');
const stopCampaignSending = require('../controllers/campaign/stop-campaign-sending');
const sendCampaign = require('../controllers/campaign/send-campaign');
const sendTestEmail = require('../controllers/campaign/email/amazon-ses/send-test');

// Middleware
const { apiIsAuth } = require('./middleware/auth');
const { writeAccess, readAccess } = require('./middleware/acl');

// Permission
const campaignPermission = require('../controllers/permissions/acl-lib/acl-campaign-permissions');

// Higher order functions decorating with the permission type
const writeCampaignAccess = (req, res, next) => writeAccess(req, res, next, campaignPermission);
const readCampaignAccess = (req, res, next) => readAccess(req, res, next, campaignPermission);

module.exports = function(app, io, redis) {
  // Get a list of all campaigns
  app.get('/api/campaign', apiIsAuth, cookieParser, readCampaignAccess, (req, res) => {
    getCampaigns(req, res);
  });
  // Export subscribers that emails were not sent/sent to during a campaign
  app.get('/api/campaign/subscribers/csv', apiIsAuth, cookieParser, readCampaignAccess, (req, res) => {
    exportSentUnsentCSV(req, res);
  });

  // Post new campaign
  app.post('/api/campaign', apiIsAuth, parseJson, cookieParser, writeCampaignAccess, (req, res) => {
    createCampaign(req, res, io);
  });
  // Delete campaign(s)
  app.delete('/api/campaign', apiIsAuth, parseJson, cookieParser, writeCampaignAccess, (req, res) => {
    deleteCampaigns(req, res);
  });

  /* Send */
  // Post to send campaign
  app.post('/api/send', apiIsAuth, parseJson, cookieParser, writeCampaignAccess, (req, res) => {
    sendCampaign(req, res, io, redis);
  });
  // Stop sending a campaign
  app.post('/api/stop', apiIsAuth, parseJson, cookieParser, writeCampaignAccess, (req, res) => {
    stopCampaignSending(req, res, redis);
  });
  // Post to send a test email
  app.post('/api/test', apiIsAuth, parseJson, cookieParser, writeCampaignAccess, (req, res) => {
    sendTestEmail(req, res);
  });
};
