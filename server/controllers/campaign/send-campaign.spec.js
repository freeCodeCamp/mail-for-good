const { expect } = require('chai');
const rewire = require('rewire');

const sendCampaign = rewire('./send-campaign');

describe('sendCampaign', () => {
  describe('howLongEmailingWillTake', () => {
    const howLongEmailingWillTake = sendCampaign.__get__('howLongEmailingWillTake');

    it('calculates how long email sending will take', () => {
    });

    it('calculates the number of remaining emails', () => {
    });

    it('shows how many subscribers the campaign will be sent to', () => {
      let expectedMessage  = 'Your campaign is being sent to 10 subscribers, it should be done in a few seconds.  Your Amazon limit for today is now 190 emails.';
      expect(howLongEmailingWillTake(10, 200, 100, 'ready').message).to.be.equal(expectedMessage);

      expectedMessage  = 'Your campaign is being sent to 1,000 subscribers, it should be done in a few seconds.  Your Amazon limit for today is now 199,000 emails.';
      expect(howLongEmailingWillTake(1000, 200000, 100, 'ready').message).to.be.equal(expectedMessage);
    });
  });
});
