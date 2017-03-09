import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import Header from './Header';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  user: {},
  ws_notification: [],
  consumeNotification: () => {},
  ...overrides
});

const wrapper = shallow(<Header {...mockProps()} />);

describe('(Component) Header', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});