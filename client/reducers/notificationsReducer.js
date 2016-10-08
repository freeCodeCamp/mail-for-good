import initialState from './initialState';
import { RECEIVE_NOTIFICATION, CONSUME_NOTIFICATION } from '../constants/actionTypes';


export default function notifications(state = initialState.notifications, action) {
  switch (action.type) {
    case RECEIVE_NOTIFICATION: {
        return {...state,
          stack: state.stack.concat(action.notification)
        };
    }
    case CONSUME_NOTIFICATION: {
      return {...state,
        stack: state.stack.slice(1)
      };
    }
    default:
      return state;
  }
}
