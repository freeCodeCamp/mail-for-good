import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import CampaignReportsTable from './CampaignReportsTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  ...overrides
});

const wrapper = shallow(<CampaignReportsTable {...mockProps()} />);

describe('(Component) CampaignReportsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});