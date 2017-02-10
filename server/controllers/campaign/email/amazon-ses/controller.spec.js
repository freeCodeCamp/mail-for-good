const { expect } = require('chai');
const httpMocks = require('node-mocks-http');
const publisher = require("fakeredis").createClient('1');
const subscriber = require("fakeredis").createClient('1');
const redis = { publisher, subscriber }

const controller = require('./controller');
const {
  sequelize,
  campaign: Campaign,
  user: User,
} = require('../../../../models');

describe('amazonEmailSendController', () => {
  it('Should send one email', async function() {

  });
});
