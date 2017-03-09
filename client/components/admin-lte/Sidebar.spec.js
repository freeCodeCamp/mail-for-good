import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Sidebar from './Sidebar';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  user: {},
  activeAccount: {}
});

const wrapper = shallow(<Sidebar {...mockProps()} />);

describe('(Component) Sidebar', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});