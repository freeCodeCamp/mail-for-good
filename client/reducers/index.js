import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import { createCampaign, manageCampaign } from './campaignReducer';
import { createList, manageList } from './listReducer';
import settings from './settingsReducer';
import notifications from './notificationsReducer';

const rootReducer = combineReducers({
  createCampaign,
  manageCampaign,
  createList,
  manageList,
  settings,
  notifications,
  routing: routerReducer,
  form: formReducer
});

export default rootReducer;
