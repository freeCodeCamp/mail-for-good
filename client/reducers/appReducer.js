import initialState from './initialState';
import {
  REQUEST_WS_PROFILE,
  COMPLETE_WS_PROFILE,
  RECEIVE_WS_NOTIFICATION,
  CONSUME_WS_NOTIFICATION
} from '../constants/actionTypes';

export function profile(state = initialState.profile, action) {
  switch(action.type) {
    case REQUEST_WS_PROFILE: {
      return {...state // Does nothing for now, as this is a websocket this can probably be removed later
      };
    }
    case COMPLETE_WS_PROFILE: {
      return {...state,
        user: action.user
      };
    }
    case RECEIVE_WS_NOTIFICATION: {
      return {...state,
        ws_notification: [...state.ws_notification, action.notification]
      };
    }
    case CONSUME_WS_NOTIFICATION: {
      const spliceArrWithoutMutatingState = state.ws_notification.slice().splice(1, action.index);
      return {...state,
        ws_notification: spliceArrWithoutMutatingState
      };
    }
    default:
      return state;
  }
}

export default {
  profile
};
