import initialState from './initialState';
import {
  REQUEST_WS_PROFILE,
  COMPLETE_WS_PROFILE
} from '../constants/actionTypes';

export function profile(state = initialState.profile, action) {
  switch(action.type) {
    case REQUEST_WS_PROFILE: {
      return {...state // Does nothing for now, as this is a websocket this can probably be removed later
      };
    }
    case COMPLETE_WS_PROFILE: {
      return {
        ...state,
        user: action.user
      };
    }
    default:
      return state;
  }
}

export default {
  profile
};
