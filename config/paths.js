const UNAUTHENTICATED_PATH = '';
const AUTHENTICATED_PATH = 'app/';

function returnRoute(path, authenticated = true) {
  const prependPath = authenticated ? AUTHENTICATED_PATH : UNAUTHENTICATED_PATH;
  return prependPath + path;
}

const routes = {
  /* UNAUTH */
  PATH_LOGIN: returnRoute('/login', false),
  PATH_GOOGLE_AUTH: returnRoute('/auth/google', false),
  PATH_GOOGLE_CALLBACK: returnRoute('/auth/google/callback', false),
  /* AUTH */
  PATH_LOGOUT: returnRoute('/logout'),
  // Campaigns
  PATH_CAMPAIGN: returnRoute('/api/campaign'),
  PATH_CAMPAIGNS_EXPORT: returnRoute('/api/campaign/subscribers/csv'),
  PATH_CAMPAIGNS_SEND: returnRoute('/api/send'),
  PATH_CAMPAIGNS_STOP: returnRoute('/api/stop'),
  PATH_CAMPAIGNS_TEST: returnRoute('/api/test'),
  // Templates
  PATH_TEMPLATES: returnRoute('/api/template'),
  // Lists
  PATH_LIST: returnRoute('/api/list'),
  PATH_LIST_MANAGE: returnRoute('/api/list/manage'),
  PATH_LIST_SUBSCRIBERS: returnRoute('/api/list/subscribers'),
  PATH_LIST_SUBSCRIBE: returnRoute('/api/list/subscribe'),
  PATH_LIST_EXPORT_CSV: returnRoute('/api/list/subscribers/csv'),
  PATH_LIST_ADD_SUBSCRIBERS: returnRoute('/api/list/add/subscribers'),
  PATH_LIST_ADD_CSV: returnRoute('/api/list/add/csv'),
  // Permissions
  PATH_PERMISSIONS: returnRoute('/api/permissions'),
  PATH_PERMISSIONS_ACTIVE: returnRoute('/api/active-permissions'),
  PATH_PERMISSIONS_RECEIVED: returnRoute('/api/received-permissions'),
  PATH_PERMISSIONS_OFFERED: returnRoute('/api/grant-offered-permissions'),
  // Analytics
  PATH_ANALYTICS_REFRESH: returnRoute('/api/analytics/refresh'),
  PATH_ANALYTICS_CLICKTHROUGH: returnRoute('/clickthrough'),
  PATH_ANALYTICS_TRACK_OPEN: returnRoute('/trackopen'),
  // Settings
  PATH_SETTINGS: returnRoute('/api/settings'),
  // Other
  PATH_UNSUBSCRIBE: returnRoute('/unsubscribe'),
};

module.exports = routes;
