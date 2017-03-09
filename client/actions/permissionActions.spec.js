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

});