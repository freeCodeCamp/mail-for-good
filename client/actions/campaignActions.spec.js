// Test actions not indirectly tested in reducers
import { expect } from 'chai';

import {  
  requestStopSending,
  completeStopSending,
  stopSending,
  getCampaigns,
  postCreateTemplate,
  postCreateCampaign,
  deleteCampaigns,
  postSendCampaign,
  postTestEmail,
  getTemplates,
  deleteTemplates
} from './campaignActions';

describe('(Actions) campaign', () => {

  it('should exist', () => {
    expect(requestStopSending).to.be.a('function');
    expect(completeStopSending).to.be.a('function');
    expect(stopSending).to.be.a('function');
    expect(getCampaigns).to.be.a('function');
    expect(postCreateTemplate).to.be.a('function');
    expect(postCreateCampaign).to.be.a('function');
    expect(deleteCampaigns).to.be.a('function');
    expect(postSendCampaign).to.be.a('function');
    expect(postTestEmail).to.be.a('function');
    expect(getTemplates).to.be.a('function');
    expect(deleteTemplates).to.be.a('function');
  });

});