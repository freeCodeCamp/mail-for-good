import { expect } from 'chai';

import {
  requestGetGrantPermissions,
  completeGetGrantPermissions,
  requestPostGrantPermission,
  completePostGrantPermission,
  requestDeleteGrantPermission,
  completeDeleteGrantPermission,
  requestGetReceivedPermissionOffers,
  completeGetReceivedPermissionOffers,
  requestPostAcceptReceivedPermissionOffers,
  completePostAcceptReceivedPermissionOffers,
  requestDeleteRejectReceivedPermissionOffers,
  completeDeleteRejectReceivedPermissionOffers,
  requestGetActivePermissions,
  completeGetActivePermissions,
  requestDeleteActivePermissions,
  completeDeleteActivePermissions,
  requestGetGrantOfferedPermissions,
  completeGetGrantOfferedPermissions,
  requestDeleteGrantOfferedPermissions,
  completeDeleteGrantOfferedPermissions,
  activateAccount,
  deactivateAccount
} from '../actions/permissionActions';

import initialState from './initialState';

import {
  grantPermissions,
  receivedPermissionOffers,
  activePermissions,
  grantOfferedPermissions,
  activeAccount
 } from './permissionReducer';

describe('(Reducer/Action Creator) permission', () => {

// grantPermissions reducer

  it('should handle REQUEST_GET_GRANT_PERMISSION', () => {
    expect(
      grantPermissions(undefined, requestGetGrantPermissions())
    ).to.deep.equal({
      ...initialState.grantPermissions,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_GRANT_PERMISSION', () => {
    const mockPayload = 'something';
    expect(
      grantPermissions(undefined, completeGetGrantPermissions(mockPayload))
    ).to.deep.equal({
      ...initialState.grantPermissions,
      isGetting: false,
      grantedPermissions: mockPayload
    });
  });

  it('should handle REQUEST_POST_GRANT_PERMISSION', () => {
    expect(
      grantPermissions(undefined, requestPostGrantPermission())
    ).to.deep.equal({
      ...initialState.grantPermissions,
      isPosting: true
    });
  });

  it('should handle COMPLETE_POST_GRANT_PERMISSION', () => {
    const mockPayload = 'something';
    expect(
      grantPermissions(undefined, completePostGrantPermission(mockPayload))
    ).to.deep.equal({
      ...initialState.grantPermissions,
      isPosting: false,
      response: mockPayload
    });
  });

  it('should handle REQUEST_DELETE_GRANT_PERMISSION', () => {
    expect(
      grantPermissions(undefined, requestDeleteGrantPermission())
    ).to.deep.equal({
      ...initialState.grantPermissions
    });
  });

  it('should handle COMPLETE_DELETE_GRANT_PERMISSION', () => {
    const mockPayload = 'something';
    expect(
      grantPermissions(undefined, completeDeleteGrantPermission(mockPayload))
    ).to.deep.equal({
      ...initialState.grantPermissions,
      grantedPermissions: mockPayload
    });
  });

// receivedPermissionOffers reducer

  it('should handle REQUEST_GET_RECEIVED_PERMISSION_OFFERS', () => {
    expect(
      receivedPermissionOffers(undefined, requestGetReceivedPermissionOffers())
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_RECEIVED_PERMISSION_OFFERS', () => {
    const mockPayload = 'something';
    expect(
      receivedPermissionOffers(undefined, completeGetReceivedPermissionOffers(mockPayload))
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers,
      isGetting: false,
      receivedPermissionOffers: mockPayload
    });
  });

  it('should handle REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS', () => {
    expect(
      receivedPermissionOffers(undefined, requestPostAcceptReceivedPermissionOffers())
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers
    });
  });

  it('should handle COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS', () => {
    const mockPayload = 'something';
    expect(
      receivedPermissionOffers(undefined, completePostAcceptReceivedPermissionOffers(mockPayload))
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers,
      receivedPermissionOffers: mockPayload
    });
  });

  it('should handle REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS', () => {
    expect(
      receivedPermissionOffers(undefined, requestDeleteRejectReceivedPermissionOffers())
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers
    });
  });

  it('should handle COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS', () => {
    const mockPayload = 'something';
    expect(
      receivedPermissionOffers(undefined, completeDeleteRejectReceivedPermissionOffers(mockPayload))
    ).to.deep.equal({
      ...initialState.receivedPermissionOffers,
      receivedPermissionOffers: mockPayload
    });
  });

// activePermissions reducer

  it('should handle REQUEST_GET_ACTIVE_PERMISSIONS', () => {
    expect(
      activePermissions(undefined, requestGetActivePermissions())
    ).to.deep.equal({
      ...initialState.activePermissions,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_ACTIVE_PERMISSIONS', () => {
    const mockPayload = 'something';
    expect(
      activePermissions(undefined, completeGetActivePermissions(mockPayload))
    ).to.deep.equal({
      ...initialState.activePermissions,
      activePermissions: mockPayload
    });
  });

  it('should handle REQUEST_DELETE_ACTIVE_PERMISSIONS', () => {
    expect(
      activePermissions(undefined, requestDeleteActivePermissions())
    ).to.deep.equal({
      ...initialState.activePermissions
    });
  });

  it('should handle COMPLETE_DELETE_ACTIVE_PERMISSIONS', () => {
    const mockPayload = 'something';
    expect(
      activePermissions(undefined, completeDeleteActivePermissions(mockPayload))
    ).to.deep.equal({
      ...initialState.activePermissions,
      activePermissions: mockPayload
    });
  });

// grantOfferedPermissions reducer

  it('should handle REQUEST_GET_GRANT_OFFERED_PERMISSIONS', () => {
    expect(
      grantOfferedPermissions(undefined, requestGetGrantOfferedPermissions())
    ).to.deep.equal({
      ...initialState.grantOfferedPermissions,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_GRANT_OFFERED_PERMISSIONS', () => {
    const mockPayload = 'something';
    expect(
      grantOfferedPermissions(undefined, completeGetGrantOfferedPermissions(mockPayload))
    ).to.deep.equal({
      ...initialState.grantOfferedPermissions,
      isGetting: false,
      grantOfferedPermissions: mockPayload
    });
  });

  it('should handle REQUEST_DELETE_GRANT_OFFERED_PERMISSIONS', () => {
    expect(
      grantOfferedPermissions(undefined, requestDeleteGrantOfferedPermissions())
    ).to.deep.equal({
      ...initialState.grantOfferedPermissions
    });
  });

  it('should handle COMPLETE_DELETE_GRANT_OFFERED_PERMISSIONS', () => {
    const mockPayload = 'something';
    expect(
      grantOfferedPermissions(undefined, completeDeleteGrantOfferedPermissions(mockPayload))
    ).to.deep.equal({
      ...initialState.grantOfferedPermissions,
      grantOfferedPermissions: mockPayload
    });
  });

// activeAccount reducer

  it('should handle ACTIVATE_ACCOUNT', () => {
    const mockPayload = { something: 'something' };
    expect(
      activeAccount(undefined, activateAccount(mockPayload))
    ).to.deep.equal({
      ...initialState.activeAccount,
      ...mockPayload
    });
  });

  it('should handle DEACTIVATE_ACCOUNT', () => {
    expect(
      activeAccount(undefined, deactivateAccount())
    ).to.deep.equal({
      ...initialState.activeAccount
    });
  });

});