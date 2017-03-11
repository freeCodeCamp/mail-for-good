import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageGrantedPermissionsTable from './ManageGrantedPermissionsTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  deletePermissionRows: () => {},
  ...overrides
});

const wrapper = shallow(<ManageGrantedPermissionsTable {...mockProps()} />);

describe('(Component) ManageGrantedPermissionsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});