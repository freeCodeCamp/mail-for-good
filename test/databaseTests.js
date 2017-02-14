require('dotenv').config();

const httpMocks = require('node-mocks-http');
const test = require('tape');
const publisher = require("fakeredis").createClient('1');
const subscriber = require("fakeredis").createClient('1');
const redis = { publisher, subscriber };

const exportSentUnsentCsv = require('../server/controllers/campaign/export-sent-unsent-csv');
const stopCampaignSending = require('../server/controllers/campaign/stop-campaign-sending');

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

  test('Test export sent/unsent CSV function', async function (t) {
    t.plan(1);
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

  test('Stop campaign send feature returns the correct status code', async function(t) {
    t.plan(1);
    await beforeEachStopSendCampaign();

    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { nope: 1 }
    };

    stopCampaignSending(req, res);

    // Test 1 - status code === 400
    // Original was 'validates that campaign id is present in request body', this doesn't look right
    t.equal(400, res.statusCode, 'Response status code from stop campaign should be 400');
  });
  test('Stop campaign publishes a cancel message to redis', async function(t) {
    t.plan(2);
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { id: 1 }
    };

    redis.subscriber.on('message', (channel, message) => {
      t.equal('stop-campaign-sending', channel, 'Redis subscriber channel is "stop-campaign-sending"');
      t.equal('1', message, 'Redis subscriber message is "1"');
      redis.subscriber.unsubscribe('stop-campaign-sending');
    });
    redis.subscriber.subscribe('stop-campaign-sending');

    stopCampaignSending(req, res, redis);
  });
  test('Stop campaign modifies the campaign status appropriately', async function(t) {
    t.plan(1);
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { id: 1 }
    };

    stopCampaignSending(req, res, redis);

    res.on('finish', () => {
      Campaign.findById(1, { raw: true }).then(campaign => {
        t.equal('interrupted', campaign.status, 'Campaign status is set to "interrupted"');
      });
    });
  });
  test('Stop campaign validates that the campaign belongs to the user', async function(t) {
    t.plan(1);
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1337 },
      body: { id: 1 }
    };

    stopCampaignSending(req, res, redis);

    res.on('finish', () => {
      t.equal(400, res.statusCode, 'Response status code equals 400');
    });
  });

  

}, 1000);

async function beforeEachStopSendCampaign() {
  await sequelize.sync({ force: true });
  await User.create({id: 1});
  await Campaign.create({
    name: 'campaign1',
    userId: 1
  });
  await redis.publisher.flushdb;
  return null;
}
