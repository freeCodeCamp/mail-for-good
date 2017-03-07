import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SidebarLink from './SidebarLink';

const mockProps = (overrides) => ({
  to: '',
  icon: '',
  children: '',
  ...overrides
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<SidebarLink {...mockProps()} />, { context: mockContext });

describe('(Component) SidebarLink', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});