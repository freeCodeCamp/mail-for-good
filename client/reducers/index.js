import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import test from './testReducer';
import settings from './settingsReducer';
import list from './listReducer';


const rootReducer = combineReducers({
  test,
  list,
  settings,
  routing: routerReducer
});

export default rootReducer;
