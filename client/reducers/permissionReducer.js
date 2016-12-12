import initialState from './initialState';
import {
  REQUEST_POST_PERMISSION_OFFER, COMPLETE_POST_PERMISSION_OFFER,

  REQUEST_GET_ACTIVE_PERMISSIONS, COMPLETE_GET_ACTIVE_PERMISSIONS,
  REQUEST_DELETE_ACTIVE_PERMISSIONS, COMPLETE_DELETE_ACTIVE_PERMISSIONS,

  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS,
  REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS,
  REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS, COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS
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
    case REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS: {
      return {...state
      };
    }
    case COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS: {
      return {...state,
        receivedPermissionOffers: action.payload
      };
    }
    case REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS: {
      return {...state
      };
    }
    case COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS: {
      return {...state,
        receivedPermissionOffers: action.payload
      };
    }
    default:
      return state;
  }
}

export function activePermissions(state = initialState.activePermissions, action) {
  switch(action.type) {
    case REQUEST_GET_ACTIVE_PERMISSIONS: {
      return {...state,
        isGetting: true
      };
    }
    case COMPLETE_GET_ACTIVE_PERMISSIONS: {
      return {...state,
        isGetting: false,
        activePermissions: action.payload
      };
    }
    case REQUEST_DELETE_ACTIVE_PERMISSIONS: {
      return {...state
      };
    }
    case COMPLETE_DELETE_ACTIVE_PERMISSIONS: {
      return {...state,
        activePermissions: action.payload
      };
    }
    default:
      return state;
  }
}

export default {
  offerPermission,
  receivedPermissionOffers,
  activePermissions
};
