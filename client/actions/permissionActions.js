import {
  REQUEST_POST_PERMISSION_OFFER, COMPLETE_POST_PERMISSION_OFFER
} from '../constants/actionTypes';
import { API_PERMISSIONS_ENDPOINT } from '../constants/endpoints';

// Create new campaign
export function requestPostPermissionOffer() {
  return { type: REQUEST_POST_PERMISSION_OFFER };
}

export function completePostPermissionOffer(payload) {
  return { type: COMPLETE_POST_PERMISSION_OFFER, payload };
}

export function postPermissionOffer(campaign) {
  return dispatch => {
    dispatch(requestPostPermissionOffer());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_PERMISSIONS_ENDPOINT);
    xhr.onload = () => {
      const permissionResponse = JSON.parse(xhr.responseText);
      dispatch(completePostPermissionOffer(permissionResponse));
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(campaign);
  };
}
