import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { CampaignViewComponent } from './CampaignView';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  postSendCampaign: () => {},
  postTestEmail: () => {},
  getCampaigns: () => {},
  stopSending: () => {},
  notify: () => {},
  campaigns: [{ slug: 'mockSlug', totalCampaignSubscribers: 0 }],
  isGetting: true,
  sendCampaign: () => {},
  isPostingSendCampaign: true,
  sendCampaignResponse: '',
  sendCampaignStatus: 0,
  isPostingSendTest: true,
  sendTestEmailResponse: '',
  sendTestEmailStatus: 0,
  params: { slug: 'mockSlug'}
});

const wrapper = shallow(<CampaignViewComponent {...mockProps()} />);

describe('(Container) CampaignView', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});