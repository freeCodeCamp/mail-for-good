import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageLists from './ManageLists';

const wrapper = shallow(<ManageLists />);

describe('(Component) ManageLists', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});