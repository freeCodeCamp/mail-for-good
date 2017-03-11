import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import DisabledLink from './DisabledLink';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  icon: '',
  children: '',
  ...overrides
});

const mockContext = {
  router: {  isActive: (a, b) => true } // eslint-disable-line no-unused-vars
};

const wrapper = shallow(<DisabledLink {...mockProps()} />, { context: mockContext });

describe('(Component) DisabledLink', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});
