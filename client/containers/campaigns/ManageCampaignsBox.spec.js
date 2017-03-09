import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageCampaignsBox } from './ManageCampaignsBox';

const mockProps = (overrides) => ({
  campaigns: [],
  isGetting: true,
  getCampaigns: () => {},
  deleteCampaigns: () => {}
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<ManageCampaignsBox {...mockProps()} />, { context: mockContext });

describe('(Container) ManageCampaignsBox', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});