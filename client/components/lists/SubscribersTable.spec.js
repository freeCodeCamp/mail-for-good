import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import SubscribersTable from './SubscribersTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  subscribers: [],
  fields: [],
  ...overrides
});

const wrapper = shallow(<SubscribersTable {...mockProps()} />);

describe('(Component) SubscribersTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});