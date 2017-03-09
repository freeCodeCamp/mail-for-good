import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import ManageActivePermissionsTable from './ManageActivePermissionsTable';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  data: [],
  deletePermissionRows: () => {},
  ...overrides
});

const wrapper = shallow(<ManageActivePermissionsTable {...mockProps()} />);

describe('(Component) ManageActivePermissionsTable', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});