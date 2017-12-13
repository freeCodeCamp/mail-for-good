import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ManageCampaignsBoxComponent } from './ManageCampaignsBox';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  campaigns: [],
  isGetting: true,
  getCampaigns: () => {},
  deleteCampaigns: () => {}
});

const mockContext = {
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<ManageCampaignsBoxComponent {...mockProps()} />, { context: mockContext });

describe('(Container) ManageCampaignsBox', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
