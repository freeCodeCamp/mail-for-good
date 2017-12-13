import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import UserInfo from './UserInfo';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  user: {},
  totalSentCount: 0,
  ...overrides
});

const wrapper = shallow(<UserInfo {...mockProps()} />);

describe('(Component) UserInfo', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});