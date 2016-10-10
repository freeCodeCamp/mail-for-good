import { REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN, REQUEST_GET_CAMPAIGNS, COMPLETE_GET_CAMPAIGNS, REQUEST_POST_SENDCAMPAIGN, COMPLETE_POST_SENDCAMPAIGN } from '../constants/actionTypes';
import { API_CAMPAIGN_ENDPOINT, API_SEND_CAMPAIGN_ENDPOINT } from '../constants/endpoints';

// Create new campaign
export function requestPostCreateCampaign() {
  return { type: REQUEST_POST_CREATECAMPAIGN };
}
export function completePostCreateCampaign() {
  return { type: COMPLETE_POST_CREATECAMPAIGN };
}

// Get array of existing campaigns
export function requestGetCampaign() {
  return { type: REQUEST_GET_CAMPAIGNS };
}
export function completeGetCampaign(campaigns) {
  return { type: COMPLETE_GET_CAMPAIGNS, campaigns };
}

// Post new send campaign request
export function requestPostSendCampaign() {
  return { type: REQUEST_POST_SENDCAMPAIGN };
}
export function completePostSendCampaign() {
  return { type: COMPLETE_POST_SENDCAMPAIGN };
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
      // Update campaigns so that the user can see the new campaign under manage campaigns
      dispatch(getCampaigns());
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}

export function postSendCampaign(campaign) {
  return dispatch => {
    dispatch(requestPostSendCampaign());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_SEND_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      dispatch(completePostSendCampaign());
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(campaign);
  };
}
