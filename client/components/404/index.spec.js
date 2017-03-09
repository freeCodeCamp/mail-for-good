import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import NotFound from '../404';

const wrapper = shallow(<NotFound />);

describe('(Component) NotFound', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});