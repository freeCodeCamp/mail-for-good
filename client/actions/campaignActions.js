import {
  REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN,
  REQUEST_GET_CAMPAIGNS, COMPLETE_GET_CAMPAIGNS,
  REQUEST_POST_SENDCAMPAIGN, COMPLETE_POST_SENDCAMPAIGN,
  REQUEST_POST_CREATETEMPLATE, COMPLETE_POST_CREATETEMPLATE,
  REQUEST_GET_TEMPLATES, COMPLETE_GET_TEMPLATES
} from '../constants/actionTypes';
import { API_CAMPAIGN_ENDPOINT, API_SEND_CAMPAIGN_ENDPOINT, API_TEMPLATE_ENDPOINT } from '../constants/endpoints';

// Create new campaign
export function requestPostCreateCampaign() {
  return { type: REQUEST_POST_CREATECAMPAIGN };
}
export function completePostCreateCampaign() {
  return { type: COMPLETE_POST_CREATECAMPAIGN };
}

// Create new template
export function requestPostCreateTemplate() {
  return { type: REQUEST_POST_CREATETEMPLATE};
}
export function completePostCreateTemplate() {
  return { type: COMPLETE_POST_CREATETEMPLATE };
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
export function completePostSendCampaign(response, status) {
  return { type: COMPLETE_POST_SENDCAMPAIGN, sendCampaignResponse: response, sendCampaignStatus: status };
}

// Get templates
export function requestGetTemplates() {
  return { type: REQUEST_GET_TEMPLATES };
}
export function completeGetTemplates(templates) {
  return { type: COMPLETE_GET_TEMPLATES, templates };
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

export function postCreateTemplate(form) {
  return dispatch => {
    dispatch(requestPostCreateTemplate());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_TEMPLATE_ENDPOINT);
    xhr.onload = () => {
      dispatch(completePostCreateTemplate());
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}

export function postCreateCampaign(form) {
  return dispatch => {
    dispatch(requestPostCreateCampaign());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      dispatch(completePostCreateCampaign());
      // Update campaigns so that the user can see the new campaign under manage campaigns
      dispatch(getCampaigns());
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}

export function deleteCampaigns(campaignIds) {
  return () => {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', API_CAMPAIGN_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(campaignIds);
  };
}

export function postSendCampaign(campaign) {
  return dispatch => {
    dispatch(requestPostSendCampaign());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_SEND_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      const sendCampaignResponse = JSON.parse(xhr.responseText);
      dispatch(completePostSendCampaign(sendCampaignResponse.message, xhr.status));
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(campaign);
  };
}

export function getTemplates() {
  return dispatch => {
    dispatch(requestGetTemplates());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_TEMPLATE_ENDPOINT);
    xhr.onload = () => {
      // Convert response from JSON
      const templatesArray = JSON.parse(xhr.responseText);
      dispatch(completeGetTemplates(templatesArray));
    };
    xhr.send();
  };
}
