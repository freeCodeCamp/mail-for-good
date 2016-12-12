import {
  REQUEST_GET_GRANT_PERMISSION, COMPLETE_GET_GRANT_PERMISSION,
  REQUEST_POST_GRANT_PERMISSION, COMPLETE_POST_GRANT_PERMISSION,

  REQUEST_GET_ACTIVE_PERMISSIONS, COMPLETE_GET_ACTIVE_PERMISSIONS,
  REQUEST_DELETE_ACTIVE_PERMISSIONS, COMPLETE_DELETE_ACTIVE_PERMISSIONS,

  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS,
  REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS,
  REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS, COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS
} from '../constants/actionTypes';
import {
  API_GRANT_PERMISSIONS_ENDPOINT,
  API_RECEIVED_PERMISSIONS_ENDPOINT,
  API_ACTIVE_PERMISSIONS_ENDPOINT
} from '../constants/endpoints';
import axios from 'axios';
import { notify } from './notificationActions';

// REST for granting permissions
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

// GRANT
export function getGrantPermissions() {
  return dispatch => {
    dispatch(requestGetGrantPermissions());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_GRANT_PERMISSIONS_ENDPOINT);
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

// ACTIVE
export function getActivePermissions() {
  return dispatch => {
    dispatch(requestGetActivePermissions());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_ACTIVE_PERMISSIONS_ENDPOINT);
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
