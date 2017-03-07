import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { Dashboard } from './Dashboard';

const mockProps = (overrides) => ({
  children: <div></div>,
  user: {},
  campaigns: []
});

const wrapper = shallow(<Dashboard {...mockProps()} />);

describe('(Container) Dashboard', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});