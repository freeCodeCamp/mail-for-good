import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageReceivedPermissionOffersTable from './ManageReceivedPermissionOffersTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  rejectRows: () => {},
  acceptRows: () => {},
  ...overrides
});

const wrapper = shallow(<ManageReceivedPermissionOffersTable {...mockProps()} />);

describe('(Component) ManageReceivedPermissionOffersTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});