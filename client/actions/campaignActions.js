import {
  REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN,
  REQUEST_GET_CAMPAIGNS, COMPLETE_GET_CAMPAIGNS,
  REQUEST_POST_SENDCAMPAIGN, COMPLETE_POST_SENDCAMPAIGN,
  REQUEST_POST_CREATETEMPLATE, COMPLETE_POST_CREATETEMPLATE,
  REQUEST_GET_TEMPLATES, COMPLETE_GET_TEMPLATES,
  COMPLETE_DELETE_CAMPAIGNS, COMPLETE_DELETE_TEMPLATES
} from '../constants/actionTypes';
import { API_CAMPAIGN_ENDPOINT, API_SEND_CAMPAIGN_ENDPOINT, API_TEMPLATE_ENDPOINT, API_TEST_SEND_CAMPAIGN_ENDPOINT } from '../constants/endpoints';

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

// Delete campaign/template
export function completeDeleteCampaigns(campaigns) {
  return { type: COMPLETE_DELETE_CAMPAIGNS, campaigns };
}
export function completeDeleteTemplates(templates) {
  return { type: COMPLETE_DELETE_TEMPLATES, templates };
}

export function getCampaigns() {
  return dispatch => {
    dispatch(requestGetCampaign());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const campaignsArray = JSON.parse(xhr.responseText).map(x => {
          x.createdAt = new Date(x.createdAt);
          x.updatedAt = new Date(x.updatedAt);
          return x;
        });

        dispatch(completeGetCampaign(campaignsArray));
      } else {
        dispatch(completeGetCampaign([]));
      }
    };
    xhr.send();
  };
}

export function postCreateTemplate(form, reset) {
  return dispatch => {
    dispatch(requestPostCreateTemplate());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_TEMPLATE_ENDPOINT);
    xhr.onload = () => {
      dispatch(completePostCreateTemplate());
      dispatch(getTemplates());
      reset();
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}

export function postCreateCampaign(form, reset) {
  return dispatch => {
    dispatch(requestPostCreateCampaign());

    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_CAMPAIGN_ENDPOINT);
    xhr.onload = () => {
      dispatch(completePostCreateCampaign());
      dispatch(getCampaigns());
      reset();
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
  };
}

export function deleteCampaigns(campaignIds, campaigns) {
  return dispatch => {
    const jsonCampaignIds = JSON.stringify({ data: campaignIds });
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', API_CAMPAIGN_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(jsonCampaignIds);
    xhr.onload = () => {
      const filterCampaigns = campaigns.filter(camp => !~campaignIds.indexOf(camp.id));
      dispatch(completeDeleteCampaigns(filterCampaigns));
    };
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

export function postTestEmail(form) {
  return () => {
    // This function is very simple and should purely pass a single testEmail and campaignId to the test campaign endpoints
    const xhr = new XMLHttpRequest();
    xhr.open('POST', API_TEST_SEND_CAMPAIGN_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(form);
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

export function deleteTemplates(templateIds, templates) {
  return dispatch => {
    const jsonCampaignIds = JSON.stringify({ data: templateIds });
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', API_TEMPLATE_ENDPOINT);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(jsonCampaignIds);
    xhr.onload = () => {
      const filterTemplates = templates.filter(temp => !~templateIds.indexOf(temp.id));
      dispatch(completeDeleteTemplates(filterTemplates));
    };
  };
}
