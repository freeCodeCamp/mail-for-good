import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageGrantOfferedPermissionsTable from './ManageGrantOfferedPermissionsTable';

const mockProps = (overrides) => ({
  data: [],
  deletePermissionRows: () => {},
  ...overrides
});

const wrapper = shallow(<ManageGrantOfferedPermissionsTable {...mockProps()} />);

describe('(Component) ManageGrantOfferedPermissionsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});