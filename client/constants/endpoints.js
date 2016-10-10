export const BASE_URL = 'http://localhost:8080';

// Dashboard

// Campaigns
export const API_CAMPAIGN_ENDPOINT = BASE_URL + '/api/campaign'; // REST (post = new campaign, get = get list of campaigns, put = update campaign, del = delete campaign)
export const API_SEND_CAMPAIGN_ENDPOINT = BASE_URL + '/api/campaign/send';

// Lists
// should refactor above variables for consistency (API_...)
export const API_SUBSCRIBERS_ENDPOINT = BASE_URL + '/api/list/add/subscribers';
export const API_IMPORTCSV_ENDPOINT = BASE_URL + '/api/list/add/csv';
export const API_MANAGELIST_ENDPOINT = BASE_URL + '/api/list/manage';
export const API_LISTSUBSCRIBERS_ENDPOINT = BASE_URL + '/api/list/subscribers';

// Analytics

// Settings
export const SETTINGS_URL_RELATIVE = '/api/settings';
export const API_SETTINGS_ENDPOINT = BASE_URL + SETTINGS_URL_RELATIVE;
