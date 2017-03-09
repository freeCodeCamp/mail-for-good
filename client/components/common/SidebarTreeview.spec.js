import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SidebarTreeview from './SidebarTreeview';

const mockProps = (overrides) => ({
  name: '',
  icon: '',
  ...overrides
});

const mockContext = {
  router: { isActive: (a, b) => true }
};

const wrapper = shallow(<SidebarTreeview {...mockProps()} />, { context: mockContext });

describe('(Component) SidebarTreeview', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});