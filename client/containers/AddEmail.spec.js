import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { AddEmail } from './AddEmail';

const mockProps = (overrides) => ({
  addSubscribers: () => {}
});

const wrapper = shallow(<AddEmail {...mockProps()} />);

describe('(Container) AddEmail', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});