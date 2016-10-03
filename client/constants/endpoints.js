export const BASE_URL = 'http://localhost:8080';

export const SETTINGS_URL_RELATIVE = '/api/settings';
export const API_SETTINGS_ENDPOINT = BASE_URL + SETTINGS_URL_RELATIVE;

// should refactor above variables for consistency (API_...)
export const API_SUBSCRIBERS_ENDPOINT = BASE_URL + '/api/list/add/subscribers';
export const API_IMPORTCSV_ENDPOINT = BASE_URL + '/api/list/add/csv';
