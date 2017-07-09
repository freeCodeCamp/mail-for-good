require('dotenv').config();

const httpMocks = require('node-mocks-http');
const test = require('tape');

const exportSentUnsentCsv = require('../../../controllers/campaign/export-sent-unsent-csv');

const {
  sequelize,
  campaignsubscriber: CampaignSubscriber,
  campaign: Campaign,
  user: User,
  list: List,
  listsubscriber: ListSubscriber
} = require('../../../models');

/*
  This test file should be used to test features that require modifications to the postgres test db.
  Mocha does not run separate test files serially. This causes conflicts when parallel tests operate on the same db.

  Tests should be functional tests.
*/


test('Test export sent/unsent CSV function', async function (t) {
  t.plan(1);
  // Clear db
  await sequelize;
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
