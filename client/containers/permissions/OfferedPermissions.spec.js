import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { OfferedPermissions } from './OfferedPermissions';

const mockProps = (overrides) => ({
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

const wrapper = shallow(<OfferedPermissions {...mockProps()} />);

describe('(Container) OfferedPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});