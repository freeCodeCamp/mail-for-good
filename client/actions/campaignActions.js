import { REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN, REQUEST_GET_CAMPAIGNS, COMPLETE_GET_CAMPAIGNS } from '../constants/actionTypes';
import { API_CAMPAIGN_ENDPOINT } from '../constants/endpoints';

export function requestPostCreateCampaign() {
  return { type: REQUEST_POST_CREATECAMPAIGN };
}

export function completePostCreateCampaign() {
  return { type: COMPLETE_POST_CREATECAMPAIGN };
}

export function requestGetCampaign() {
  return { type: REQUEST_GET_CAMPAIGNS };
}

export function completeGetCampaign(campaigns) {
  return { type: COMPLETE_GET_CAMPAIGNS, campaigns };
}

export function getCampaigns() {
  return dispatch => {
    dispatch(requestGetCampaign());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      // Convert response from JSON
      const campaignsArray = JSON.parse(xhr.responseText);
      dispatch(completeGetCampaign(campaignsArray));
    };
    xhr.send();
  };
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
