// Test actions not indirectly tested in reducers
import { expect } from 'chai';

import {  
  getGrantPermissions,
  postGrantPermission,
  deleteGrantedPermissions,
  getActivePermissions,
  deleteActivePermissions,
  getReceivedPermissionOffers,
  postAcceptReceivedOffers,
  deleteRejectReceivedOffers,
  getGrantOfferedPermissions,
  deleteGrantOfferedPermissions,
  becomeAnotherUser,
  becomeSelf
} from './permissionActions';

describe('(Actions) permission', () => {

  it('should exist', () => {
    expect(getGrantPermissions).to.be.a('function');
    expect(postGrantPermission).to.be.a('function');
    expect(deleteGrantedPermissions).to.be.a('function');
    expect(getActivePermissions).to.be.a('function');
    expect(deleteActivePermissions).to.be.a('function');
    expect(getReceivedPermissionOffers).to.be.a('function');
    expect(postAcceptReceivedOffers).to.be.a('function');
    expect(deleteRejectReceivedOffers).to.be.a('function');
    expect(getGrantOfferedPermissions).to.be.a('function');
    expect(deleteGrantOfferedPermissions).to.be.a('function');
    expect(becomeAnotherUser).to.be.a('function');
    expect(becomeSelf).to.be.a('function');
  });

});