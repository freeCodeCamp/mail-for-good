import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Footer from './Footer';

const wrapper = shallow(<Footer />);

describe('(Component) Footer', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});