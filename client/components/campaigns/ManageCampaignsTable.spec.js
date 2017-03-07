import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageCampaignsTable from './ManageCampaignsTable';

const mockProps = (overrides) => ({
  data: [],
  deleteRows: () => {},
  getCampaignView: () => {},
  ...overrides
});

const wrapper = shallow(<ManageCampaignsTable {...mockProps()} />);

describe('(Component) ManageCampaignsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});