import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'

import { createCampaign, manageCampaign } from './campaignReducer';
import { createList, manageList, manageListSubscribers } from './listReducer';
import settings from './settingsReducer';

const rootReducer = combineReducers({
  createCampaign,
  manageCampaign,
  createList,
  manageList,
  manageListSubscribers,
  settings,
  routing: routerReducer,
  form: formReducer
});

export default rootReducer;
