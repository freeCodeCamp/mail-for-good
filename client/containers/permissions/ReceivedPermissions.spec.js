import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import { ReceivedPermissions } from './ReceivedPermissions';

const mockProps = (overrides) => ({
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

const wrapper = shallow(<ReceivedPermissions {...mockProps()} />);

describe('(Container) ReceivedPermissions', () => {
  it('renders without exploding', () => {
    expect(wrapper).to.have.lengthOf(1);
  });
});