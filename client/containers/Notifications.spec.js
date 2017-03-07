import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { Notifications } from './Notifications';

const mockProps = (overrides) => ({
  notifications: [],
  consume: () => {}
});

const wrapper = shallow(<Notifications {...mockProps()} />);

describe('(Container) Notifications', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});