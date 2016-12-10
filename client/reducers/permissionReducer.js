import initialState from './initialState';
import {
  REQUEST_POST_PERMISSION_OFFER, COMPLETE_POST_PERMISSION_OFFER
} from '../constants/actionTypes';

export function offerPermission(state = initialState.offerPermission, action) {
  switch(action.type) {
    case REQUEST_POST_PERMISSION_OFFER: {
      return {...state,
        isPosting: true
      };
    }
    case COMPLETE_POST_PERMISSION_OFFER: {
      return {...state,
        isPosting: false,
        response: action.payload
      };
    }
    default:
      return state;
  }
}

export default {
  offerPermission
};
