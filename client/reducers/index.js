import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import { createCampaign, manageCampaign, sendCampaign } from './campaignReducer';
import { createList, manageList, manageListSubscribers } from './listReducer';
import settings from './settingsReducer';
import notifications from './notificationsReducer';

const rootReducer = combineReducers({
  createCampaign,
  manageCampaign,
  sendCampaign,
  createList,
  manageList,
  manageListSubscribers,
  settings,
  notifications,
  routing: routerReducer,
  form: formReducer
});

export default rootReducer;
