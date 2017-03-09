import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SidebarTreeview from './SidebarTreeview';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  name: '',
  icon: '',
  ...overrides
});

const mockContext = {
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<SidebarTreeview {...mockProps()} />, { context: mockContext });

describe('(Component) SidebarTreeview', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});