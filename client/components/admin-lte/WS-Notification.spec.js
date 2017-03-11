import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import WSNotification from './WS-Notification';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  message: '',
  icon: '',
  iconColour: '',
  consumeNotification: () => {},
  index: 0,
  ...overrides
});

const wrapper = shallow(<WSNotification {...mockProps()} />);

describe('(Component) WSNotification', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});