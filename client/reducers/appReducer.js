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
      // This code fires whenever a websocket packet is received
      // The server can set up and { id } prop that we can use to see if the incoming notification is an Update
        // to and existing notification.

      // Check for an index an object that has an id matching the new notification.
      // If true, replace. Else, push the new notification.
      const ws_notification_exists = state.ws_notification.findIndex(x => x.id === action.notification.id);

      // Create a shallow copy of the notification stack
      const sliceState = state.ws_notification.slice();

      let newState;
      // If the incoming ws is not an update to an existing notification
      if (ws_notification_exists === -1 ) {
        // New state is a concat of the existing notification stack & the new notification
        newState = [...state.ws_notification, action.notification];
      } else {
        // Otherwise, replace the notification that we're updating from the existing stack
        sliceState.splice(ws_notification_exists, 1, action.notification);
        newState = sliceState;
      }
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
