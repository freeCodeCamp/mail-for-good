import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import test from './testReducer';
import settings from './settingsReducer';


const rootReducer = combineReducers({
  test,
  settings,
  routing: routerReducer
});

export default rootReducer;
