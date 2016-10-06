import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form'
import test from './testReducer';
import settings from './settingsReducer';
import { createList, manageList } from './listReducer';


const rootReducer = combineReducers({
  test,
  createList,
  manageList,
  settings,
  routing: routerReducer,
  form: formReducer
});

export default rootReducer;
