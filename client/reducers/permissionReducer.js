import initialState from './initialState';
import {
  REQUEST_POST_PERMISSION_OFFER, COMPLETE_POST_PERMISSION_OFFER,
  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS
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

export function receivedPermissionOffers(state = initialState.receivedPermissionOffers, action) {
  switch(action.type) {
    case REQUEST_GET_RECEIVED_PERMISSION_OFFERS: {
      return {...state,
        isGetting: true
      };
    }
    case COMPLETE_GET_RECEIVED_PERMISSION_OFFERS: {
      return {...state,
        isGetting: false,
        receivedPermissionOffers: action.payload
      };
    }
    default:
      return state;
  }
}

export default {
  offerPermission,
  receivedPermissionOffers
};
