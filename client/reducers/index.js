import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import test from './testReducer';


const rootReducer = combineReducers({
  test,
  routing: routerReducer
});

export default rootReducer;
