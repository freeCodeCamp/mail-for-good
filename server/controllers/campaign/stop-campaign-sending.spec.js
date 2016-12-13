const { expect } = require('chai');
const stopCampaignSending = require('./stop-campaign-sending');
const {
  sequelize,
  campaign: Campaign,
  user: User,
} = require('../../models');

describe('stopCampaignSending', () => {
  xit('validates that campaign id is present in request body', () => {
  });

  xit('sets the appropriate flags in redis', () => {
  });

  xit('sends a success message after redis flags have been set', () => {
  });

  xit('validates that the campaign belongs to the user', () => {
  });
});
