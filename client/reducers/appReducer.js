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
      // Check for an index an object that has an id matching the new notification. If true, replace. Else, push the new notification.
      const ws_notification_exists = state.ws_notification.findIndex(x => x.id === action.notification.id);

      const sliceState = state.ws_notification.slice();

      let newState;
      if (ws_notification_exists === -1 ) {
        newState = [...state.ws_notification, action.notification];
      } else {
        sliceState.splice(ws_notification_exists, 1, action.notification);
        newState = sliceState;
      }
      console.log(newState, ws_notification_exists, action.notification);
      return {...state,
        ws_notification: newState
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
