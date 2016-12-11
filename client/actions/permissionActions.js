import {
  REQUEST_GET_ACTIVE_PERMISSIONS, COMPLETE_GET_ACTIVE_PERMISSIONS,
  REQUEST_POST_PERMISSION_OFFER, COMPLETE_POST_PERMISSION_OFFER,
  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS,
  REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS
} from '../constants/actionTypes';
import { API_GRANT_PERMISSIONS_ENDPOINT, API_RECEIVED_PERMISSIONS_ENDPOINT, API_ACTIVE_PERMISSIONS_ENDPOINT } from '../constants/endpoints';
import axios from 'axios';
import { notify } from './notificationActions';

// REST for granting permissions
export function requestPostPermissionOffer() {
  return { type: REQUEST_POST_PERMISSION_OFFER };
}
export function completePostPermissionOffer(payload) {
  return { type: COMPLETE_POST_PERMISSION_OFFER, payload };
}

// REST active permissions
export function requestGetActivePermissions() {
  return { type: REQUEST_GET_ACTIVE_PERMISSIONS };
}
export function completeGetActivePermissions(payload) {
  return { type: COMPLETE_GET_ACTIVE_PERMISSIONS, payload };
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

// GRANT
export function postPermissionOffer(campaign) {
  return dispatch => {
    dispatch(requestPostPermissionOffer());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_GRANT_PERMISSIONS_ENDPOINT);
    xhr.onload = () => {
      const permissionResponse = JSON.parse(xhr.responseText);
      const status = xhr.status;
      dispatch(completePostPermissionOffer({ ...permissionResponse, status  }));
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

// RECEIVE
export function getReceivedPermissionOffers() {
  return dispatch => {
    dispatch(requestGetActivePermissions());
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

export function postAcceptReceivedOffers(offerIds) {
  return dispatch => {
    dispatch(requestPostAcceptReceivedPermissionOffers());
    axios.post(API_RECEIVED_PERMISSIONS_ENDPOINT, {
      data: { offerIds }
    }).then(response => {
      dispatch(notify({ message: response.data, colour: 'green' }));
      dispatch(completePostAcceptReceivedPermissionOffers());
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
      dispatch(completePostAcceptReceivedPermissionOffers());
    });
  };
}
