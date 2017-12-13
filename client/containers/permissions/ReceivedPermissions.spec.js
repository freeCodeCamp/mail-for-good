import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ReceivedPermissionsComponent } from './ReceivedPermissions';

const mockProps = ( overrides) => ({ // eslint-disable-line no-unused-vars
  isGettingReceivedPermissionOffers: true,
  receivedPermissionOffers: [],
  isGettingActivePermissions: true,
  activePermissions: [],
  getReceivedPermissionOffers: () => {},
  deleteRejectReceivedOffers: () => {},
  getActivePermissions: () => {},
  deleteActivePermissions: () => {},
  postAcceptReceivedOffers: () => {},
  notify: () => {}
});

const wrapper = shallow(<ReceivedPermissionsComponent {...mockProps()} />);

describe('(Container) ReceivedPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});