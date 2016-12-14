const { expect } = require('chai');
const httpMocks = require('node-mocks-http');
const publisher = require("fakeredis").createClient('1');
const subscriber = require("fakeredis").createClient('1');
const redis = { publisher, subscriber }

const stopCampaignSending = require('./stop-campaign-sending');
const {
  sequelize,
  campaign: Campaign,
  user: User,
} = require('../../models');

describe('stopCampaignSending', () => {
  beforeEach(done => {
    sequelize.sync({ force: true }).then(() => {
      User.create({id: 1}).then(user => {
        Campaign.create({
          name: 'campaign1',
          userId: 1
        }).then(campaign => {
          redis.publisher.flushdb(() => {
            done();
          })
        });
      });
    });
  });

  it('validates that campaign id is present in request body', () => {
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { nope: 1 }
    };

    stopCampaignSending(req, res);

    res.on('finish', () => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });

  it('publishes a cancel message to redis', done => {
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { id: 1 }
    };

    redis.subscriber.on('message', (channel, message) => {
      expect(channel).to.be.equal('stop-campaign-sending');
      expect(message).to.be.equal('1');
      redis.subscriber.unsubscribe('stop-campaign-sending');
      done();
    });
    redis.subscriber.subscribe('stop-campaign-sending');

    stopCampaignSending(req, res, redis);
  });

  xit('sends a success message after redis flags have been set', () => {
  });

  it('modifies the campaign status appropriately', done => {
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1 },
      body: { id: 1 }
    };

    stopCampaignSending(req, res, redis);

    res.on('finish', () => {
      Campaign.findById(1, { raw: true }).then(campaign => {
        expect(campaign.status).to.be.equal('interrupted');
      });

      done();
    });
  });

  it('validates that the campaign belongs to the user', done => {
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: { id: 1337 },
      body: { id: 1 }
    };

    stopCampaignSending(req, res, redis);

    res.on('finish', () => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });
});
