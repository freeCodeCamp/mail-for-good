import initialState from './initialState';
import { TEST_ACTION } from '../constants/actionTypes';


export default function test(state = initialState.test, action) {
  switch (action.type) {
    case TEST_ACTION:
    default:
      return state;
  }
}
