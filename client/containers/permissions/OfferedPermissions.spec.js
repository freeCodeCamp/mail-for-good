import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { OfferedPermissionsComponent } from './OfferedPermissions';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  isGettingGrantedPermissions: true,
  grantedPermissions: [],
  isGettingGrantOfferedPermissions: true,
  grantOfferedPermissions: [],
  getGrantPermissions: () => {},
  deleteGrantedPermissions: () => {},
  getGrantOfferedPermissions: () => {},
  deleteGrantOfferedPermissions: () => {},
  notify: () => {}
});

const wrapper = shallow(<OfferedPermissionsComponent {...mockProps()} />);

describe('(Container) OfferedPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});