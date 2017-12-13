import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { NotificationsComponent } from './Notifications';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  notifications: [],
  consume: () => {}
});

const wrapper = shallow(<NotificationsComponent {...mockProps()} />);

describe('(Container) Notifications', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});