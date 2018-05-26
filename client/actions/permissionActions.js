import {
  REQUEST_GET_GRANT_PERMISSION, COMPLETE_GET_GRANT_PERMISSION,
  REQUEST_POST_GRANT_PERMISSION, COMPLETE_POST_GRANT_PERMISSION,
  REQUEST_DELETE_GRANT_PERMISSION, COMPLETE_DELETE_GRANT_PERMISSION,

  REQUEST_GET_ACTIVE_PERMISSIONS, COMPLETE_GET_ACTIVE_PERMISSIONS,
  REQUEST_DELETE_ACTIVE_PERMISSIONS, COMPLETE_DELETE_ACTIVE_PERMISSIONS,

  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS,
  REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS,
  REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS, COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS,

  REQUEST_GET_GRANT_OFFERED_PERMISSIONS, COMPLETE_GET_GRANT_OFFERED_PERMISSIONS,
  REQUEST_DELETE_GRANT_OFFERED_PERMISSIONS, COMPLETE_DELETE_GRANT_OFFERED_PERMISSIONS,

  ACTIVATE_ACCOUNT, DEACTIVATE_ACCOUNT
} from '../constants/actionTypes';
import {
  API_CREATE_USER_ENDPOINT,
  API_DELETE_USER_ENDPOINT,
  API_GRANT_PERMISSIONS_ENDPOINT,
  API_RECEIVED_PERMISSIONS_ENDPOINT,
  API_ACTIVE_PERMISSIONS_ENDPOINT,
  API_GRANT_OFFERED_PERMISSIONS_ENDPOINT
} from '../constants/endpoints';
import axios from 'axios';
import cookie from 'react-cookie';
import { notify } from './notificationActions';

// REST for granting permissions
export function requestDeleteUser() {
  return { type: REQUEST_DELETE_USER };
}
export function completeDeleteUser() {
  return { type: COMPLETE_DELETE_USER };
}
export function requestGetGrantPermissions() {
  return { type: REQUEST_GET_GRANT_PERMISSION };
}
export function completeGetGrantPermissions(payload) {
  return { type: COMPLETE_GET_GRANT_PERMISSION, payload };
}
export function requestPostGrantPermission() {
  return { type: REQUEST_POST_GRANT_PERMISSION };
}
export function completePostGrantPermission(payload) {
  return { type: COMPLETE_POST_GRANT_PERMISSION, payload };
}
export function requestDeleteGrantPermission() {
  return { type: REQUEST_DELETE_GRANT_PERMISSION };
}
export function completeDeleteGrantPermission(payload) {
  return { type: COMPLETE_DELETE_GRANT_PERMISSION, payload };
}

// REST active permissions
export function requestGetActivePermissions() {
  return { type: REQUEST_GET_ACTIVE_PERMISSIONS };
}
export function completeGetActivePermissions(payload) {
  return { type: COMPLETE_GET_ACTIVE_PERMISSIONS, payload };
}
export function requestDeleteActivePermissions() {
  return { type: REQUEST_DELETE_ACTIVE_PERMISSIONS };
}
export function completeDeleteActivePermissions(payload) {
  return { type: COMPLETE_DELETE_ACTIVE_PERMISSIONS, payload };
}

// REST for received permission offers
export function requestGetReceivedPermissionOffers() {
  return { type: REQUEST_GET_RECEIVED_PERMISSION_OFFERS };
}
export function completeGetReceivedPermissionOffers(payload) {
  return { type: COMPLETE_GET_RECEIVED_PERMISSION_OFFERS, payload };
}
export function requestPostAcceptReceivedPermissionOffers() {
  return { type: REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS };
}
export function completePostAcceptReceivedPermissionOffers(payload) {
  return { type: COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, payload };
}
export function requestDeleteRejectReceivedPermissionOffers() {
  return { type: REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS };
}
export function completeDeleteRejectReceivedPermissionOffers(payload) {
  return { type: COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS, payload };
}

// REST for offered permissions - shows permission offers from granter -> grantee
export function requestGetGrantOfferedPermissions() {
  return { type: REQUEST_GET_GRANT_OFFERED_PERMISSIONS };
}
export function completeGetGrantOfferedPermissions(payload) {
  return { type: COMPLETE_GET_GRANT_OFFERED_PERMISSIONS, payload };
}
export function requestDeleteGrantOfferedPermissions() {
  return { type: REQUEST_DELETE_GRANT_OFFERED_PERMISSIONS };
}
export function completeDeleteGrantOfferedPermissions(payload) {
  return { type: COMPLETE_DELETE_GRANT_OFFERED_PERMISSIONS, payload };
}

// App state - set active account
export function activateAccount(payload) {
  return { type: ACTIVATE_ACCOUNT, payload };
}
export function deactivateAccount() {
  return { type: DEACTIVATE_ACCOUNT };
}

// GRANT
export function getGrantPermissions() {
  return dispatch => {
    dispatch(requestGetGrantPermissions());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_GRANT_PERMISSIONS_ENDPOINT);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript');
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const permissionsArray = JSON.parse(xhr.responseText).map(x => {
          x.createdAt = new Date(x.createdAt);
          x.updatedAt = new Date(x.updatedAt);
          return x;
        });

        dispatch(completeGetGrantPermissions(permissionsArray));
      } else {
        dispatch(completeGetGrantPermissions([]));
      }
    };
    xhr.send();
  };
}

export function postGrantPermission(campaign) {
  return dispatch => {
    dispatch(requestPostGrantPermission());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_GRANT_PERMISSIONS_ENDPOINT);
    xhr.onload = () => {
      const permissionResponse = JSON.parse(xhr.responseText);
      const status = xhr.status;
      dispatch(completePostGrantPermission({ ...permissionResponse, status  }));
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(campaign);
  };
}

export function deleteGrantedPermissions(offerIds, grantedPermissions) {
  return dispatch => {
    dispatch(requestDeleteGrantPermission());
    axios.delete(API_GRANT_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data.message, colour: 'green' }));
      // Remove deleted lists from state
      const filterGrantedPermissions = grantedPermissions.filter(offer => !~offerIds.indexOf(offer.id));
      dispatch(completeDeleteGrantPermission(filterGrantedPermissions));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completeDeleteGrantPermission(grantedPermissions));
    });
  };
}

// ACTIVE
export function getActivePermissions() {
  return dispatch => {
    dispatch(requestGetActivePermissions());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_ACTIVE_PERMISSIONS_ENDPOINT);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript');
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const permissionsArray = JSON.parse(xhr.responseText).map(x => {
          x.createdAt = new Date(x.createdAt);
          x.updatedAt = new Date(x.updatedAt);
          return x;
        });

        dispatch(completeGetActivePermissions(permissionsArray));
      } else {
        dispatch(completeGetActivePermissions([]));
      }
    };
    xhr.send();
  };
}

export function deleteActivePermissions(offerIds, activePermissions) {
  return dispatch => {
    dispatch(requestDeleteActivePermissions());
    axios.delete(API_ACTIVE_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data.message, colour: 'green' }));
      // Remove deleted lists from state
      const filterActivePermissions = activePermissions.filter(offer => !~offerIds.indexOf(offer.id));
      dispatch(completeDeleteActivePermissions(filterActivePermissions));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completeDeleteActivePermissions(activePermissions));
    });
  };
}

// RECEIVE
export function getReceivedPermissionOffers() {
  return dispatch => {
    dispatch(requestGetReceivedPermissionOffers());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_RECEIVED_PERMISSIONS_ENDPOINT);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript');
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const receivedPermissionArray = JSON.parse(xhr.responseText).map(x => {
          x.createdAt = new Date(x.createdAt);
          x.updatedAt = new Date(x.updatedAt);
          return x;
        });

        dispatch(completeGetReceivedPermissionOffers(receivedPermissionArray));
      } else {
        dispatch(completeGetReceivedPermissionOffers([]));
      }
    };
    xhr.send();
  };
}

export function postAcceptReceivedOffers(offerIds, receivedOffers) {
  return dispatch => {
    dispatch(requestPostAcceptReceivedPermissionOffers());
    axios.post(API_RECEIVED_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data.message, colour: 'green' }));
      const filterReceivedOfferIds = receivedOffers.filter(offer => !~offerIds.indexOf(offer.id));
      dispatch(completePostAcceptReceivedPermissionOffers(filterReceivedOfferIds));
      dispatch(getActivePermissions());
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completePostAcceptReceivedPermissionOffers());
    });
  };
}

export function deleteRejectReceivedOffers(offerIds, receivedOffers) {
  return dispatch => {
    dispatch(requestDeleteRejectReceivedPermissionOffers());
    axios.delete(API_RECEIVED_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data.message, colour: 'green' }));
      // Remove deleted lists from state
      const filterReceivedOfferIds = receivedOffers.filter(offer => !~offerIds.indexOf(offer.id));
      dispatch(completeDeleteRejectReceivedPermissionOffers(filterReceivedOfferIds));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completeDeleteRejectReceivedPermissionOffers(receivedOffers));
    });
  };
}

// GRANT OFFERED
export function getGrantOfferedPermissions() {
  return dispatch => {
    dispatch(requestGetGrantOfferedPermissions());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_GRANT_OFFERED_PERMISSIONS_ENDPOINT);
    xhr.setRequestHeader('Accept', 'application/json, text/javascript');
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const permissionsArray = JSON.parse(xhr.responseText).map(x => {
          x.createdAt = new Date(x.createdAt);
          x.updatedAt = new Date(x.updatedAt);
          return x;
        });

        dispatch(completeGetGrantOfferedPermissions(permissionsArray));
      } else {
        dispatch(completeGetGrantOfferedPermissions([]));
      }
    };
    xhr.send();
  };
}

export function deleteGrantOfferedPermissions(offerIds, grantOfferedPermisions) {
  return dispatch => {
    dispatch(requestDeleteGrantOfferedPermissions());
    axios.delete(API_GRANT_OFFERED_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data.message, colour: 'green' }));
      // Remove deleted lists from state
      const filterGrantOfferedPermissions = grantOfferedPermisions.filter(offer => !~offerIds.indexOf(offer.id));
      dispatch(completeDeleteGrantOfferedPermissions(filterGrantOfferedPermissions));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completeDeleteGrantOfferedPermissions(grantOfferedPermisions));
    });
  };
}

// App state - change user account

export function becomeAnotherUser(thisAccount) {
  return dispatch => {
    // Save to cookie storing the active user's ACL id, this will be sent along with all http requests to the server
    cookie.save('user', thisAccount.id, { path: '/' });
    dispatch(activateAccount(thisAccount));
  };
}

export function becomeSelf() {
  return dispatch => {
    // Save to cookie storing the active user's ACL id, this will be sent along with all http requests to the server
    cookie.remove('user', { path: '/' });
    dispatch(deactivateAccount());
  };
}
