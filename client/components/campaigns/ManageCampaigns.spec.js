import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageCampaigns from './ManageCampaigns';

const wrapper = shallow(<ManageCampaigns />);

describe('(Component) ManageCampaigns', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
