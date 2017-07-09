import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { DashboardComponent } from './Dashboard';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  children: <div />,
  user: {},
  campaigns: []
});

const wrapper = shallow(<DashboardComponent {...mockProps()} />);

describe('(Container) Dashboard', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
