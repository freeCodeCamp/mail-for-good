import { REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN } from '../constants/actionTypes';
import { API_CAMPAIGN_ENDPOINT } from '../constants/endpoints';

export function requestPostCreateCampaign() {
  return { type: REQUEST_POST_CREATECAMPAIGN };
}

export function completePostCreateCampaign() {
  return { type: COMPLETE_POST_CREATECAMPAIGN };
}

export function postCreateCampaign(form) {
  return dispatch => {
    dispatch(requestPostCreateCampaign());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      // Convert response from JSON
      dispatch(completePostCreateCampaign());
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}
