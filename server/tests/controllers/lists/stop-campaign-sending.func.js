require('dotenv').config();

const httpMocks = require('node-mocks-http');
const test = require('tape');
const publisher = require("fakeredis").createClient('1');
const subscriber = require("fakeredis").createClient('1');
const redis = { publisher, subscriber };

const stopCampaignSending = require('../../../controllers/campaign/stop-campaign-sending');

const {
  sequelize,
  campaign: Campaign,
  user: User,
} = require('../../../models');

/*
  This test file should be used to test features that require modifications to the postgres test db.
  Mocha does not run separate test files serially. This causes conflicts when parallel tests operate on the same db.

  Tests should be functional tests.
*/

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

test('Stop campaign modifies the campaign status appropriately', async function(t) {
  t.plan(1);
  await beforeEachStopSendCampaign();

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
  await beforeEachStopSendCampaign();

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
