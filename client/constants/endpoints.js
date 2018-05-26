export const BASE_URL = window.location.origin;

// Dashboard

// Campaigns
export const API_CAMPAIGN_ENDPOINT = BASE_URL + '/api/campaign'; // REST (post = new campaign, get = get list of campaigns, put = update campaign, del = delete campaign)
export const API_SEND_CAMPAIGN_ENDPOINT = BASE_URL + '/api/send';
export const API_TEST_SEND_CAMPAIGN_ENDPOINT = BASE_URL + '/api/test';
export const API_TEMPLATE_ENDPOINT = BASE_URL + '/api/template';
export const API_STOP_SENDING = BASE_URL + '/api/stop';

// Lists
// should refactor above variables for consistency (API_...)
export const API_SUBSCRIBERS_ENDPOINT = BASE_URL + '/api/list/add/subscribers';
export const API_IMPORTCSV_ENDPOINT = BASE_URL + '/api/list/add/csv';
export const API_MANAGELIST_ENDPOINT = BASE_URL + '/api/list/manage';
export const API_LISTSUBSCRIBERS_ENDPOINT = BASE_URL + '/api/list/subscribers';
export const API_LIST_ENDPOINT = BASE_URL + '/api/list';

// Analytics

// Permissions
export const API_CREATE_USER_ENDPOINT = '/api/create-user';
export const API_DELETE_USER_ENDPOINT = '/api/delete-user';
export const API_GRANT_PERMISSIONS_ENDPOINT = '/api/permissions';
export const API_ACTIVE_PERMISSIONS_ENDPOINT = '/api/active-permissions';
export const API_RECEIVED_PERMISSIONS_ENDPOINT = '/api/received-permissions';
export const API_GRANT_OFFERED_PERMISSIONS_ENDPOINT = '/api/grant-offered-permissions';

// Settings
export const SETTINGS_URL_RELATIVE = '/api/settings';
export const API_SETTINGS_ENDPOINT = BASE_URL + SETTINGS_URL_RELATIVE;
