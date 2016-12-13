const { expect } = require('chai');
const httpMocks = require('node-mocks-http');

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
          done();
        });
      });
    });
  });

  xit('validates that campaign id is present in request body', () => {
  });

  xit('sets the appropriate flags in redis', () => {
  });

  xit('sends a success message after redis flags have been set', () => {
  });

  it('validates that the campaign belongs to the user', (done) => {
    const res = httpMocks.createResponse({ eventEmitter: require('events').EventEmitter });
    const req = {
      user: {id: 1337},
      body: {id: 1}
    };

    stopCampaignSending(req, res);
    res.on('finish', () => {
      expect(res.statusCode).to.be.equal(400);
      done();
    });
  });
});
