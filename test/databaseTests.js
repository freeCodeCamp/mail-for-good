require('dotenv').config();

const { expect } = require('chai');
const httpMocks = require('node-mocks-http');
const test = require('tape');
const publisher = require("fakeredis").createClient('1');
const subscriber = require("fakeredis").createClient('1');
const redis = { publisher, subscriber };

const stopCampaignSending = require('../server/controllers/campaign/stop-campaign-sending');
const exportSentUnsentCsv = require('../server/controllers/campaign/export-sent-unsent-csv');

const {
  sequelize,
  campaignanalytics: CampaignAnalytics,
  campaignsubscriber: CampaignSubscriber,
  campaign: Campaign,
  user: User,
  list: List,
  listsubscriber: ListSubscriber
} = require('../server/models');

/*
  This test file should be used to test features that require modifications to the postgres test db.
  Mocha does not run separate test files serially. This causes conflicts when parallel tests operate on the same db.

  Tests should be functional tests.
*/

// HACK: We need to wait for the db to initialise - so we'll just wait for a second here
setTimeout(() => {

test('timing test', async function (t) {
  // Clear db
  await sequelize.sync({ force: true });

  // Create user and list
  const user = await User.create({});
  const list = await List.create({
    name: 'list1',
    userId: user.id
  });

  // Bulk create 3x listsubscribers, 3x campaign subscribers and a campaign
  await ListSubscriber.bulkCreate([
    { listId: list.id, email: 'someone@someone.com' },
    { listId: list.id, email: 'someone2@someone.com' },
    { listId: list.id, email: 'someone3@someone.com' }
  ]);
  const campaign = Campaign.create({ userId: user.id, listId: list.id });
  await CampaignSubscriber.bulkCreate([
    { listId: list.id, email: 'someone@someone.com', campaignId: campaign.id },
    { listId: list.id, email: 'someone2@someone.com', campaignId: campaign.id },
    { listId: list.id, email: 'someone3@someone.com' , campaignId: campaign.id }
  ]);

  // Mock a request, then log data returned by exportSentUnsentCsv
  const request = {
    user: { id: user.id },
    query: { campaignId: campaign.id, sent: false }
  };

  const response = httpMocks.createResponse();
  exportSentUnsentCsv(request, response);
  t.equal(200, response.statusCode, 'Export sent/unsent CSV returns status code 200');

});

}, 1000);
