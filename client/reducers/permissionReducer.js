import initialState from './initialState';
import {
  REQUEST_GET_GRANT_PERMISSION, COMPLETE_GET_GRANT_PERMISSION,
  REQUEST_POST_GRANT_PERMISSION, COMPLETE_POST_GRANT_PERMISSION,
  REQUEST_DELETE_GRANT_PERMISSION, COMPLETE_DELETE_GRANT_PERMISSION,

  REQUEST_GET_ACTIVE_PERMISSIONS, COMPLETE_GET_ACTIVE_PERMISSIONS,
  REQUEST_DELETE_ACTIVE_PERMISSIONS, COMPLETE_DELETE_ACTIVE_PERMISSIONS,

  REQUEST_GET_RECEIVED_PERMISSION_OFFERS, COMPLETE_GET_RECEIVED_PERMISSION_OFFERS,
  REQUEST_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS, COMPLETE_POST_ACCEPT_RECEIVED_PERMISSION_OFFERS,
  REQUEST_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS, COMPLETE_DELETE_REJECT_RECEIVED_PERMISSION_OFFERS,

  REQUEST_GET_GRANT_OFFERED_PERMISSIONS, COMPLETE_GET_GRANT_OFFERED_PERMISSIONS,
  REQUEST_DELETE_GRANT_OFFERED_PERMISSIONS, COMPLETE_DELETE_GRANT_OFFERED_PERMISSIONS,

  ACTIVATE_ACCOUNT, DEACTIVATE_ACCOUNT
} from '../constants/actionTypes';

export function grantPermissions(state = initialState.grantPermissions, action) {
  switch(action.type) {
    case REQUEST_GET_GRANT_PERMISSION: {
      return {...state,
        isGetting: true
      };
    }
    case COMPLETE_GET_GRANT_PERMISSION: {
      return {...state,
        isGetting: false,
        grantedPermissions: action.payload
      };
    }
    case REQUEST_POST_GRANT_PERMISSION: {
      return {...state,
        isPosting: true
      };
    }
    case COMPLETE_POST_GRANT_PERMISSION: {
      return {...state,
        isPosting: false,
        response: action.payload
      };
    }
    case REQUEST_DELETE_GRANT_PERMISSION: {
      return {...state,
      };
    }
    case COMPLETE_DELETE_GRANT_PERMISSION: {
      return {...state,
        grantedPermissions: action.payload
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

export function grantOfferedPermissions(state = initialState.grantOfferedPermissions, action) {
  switch(action.type) {
    case REQUEST_GET_GRANT_OFFERED_PERMISSIONS: {
      return {...state,
        isGetting: true
      };
    }
    case COMPLETE_GET_GRANT_OFFERED_PERMISSIONS: {
      return {...state,
        isGetting: false,
        grantOfferedPermissions: action.payload
      };
    }
    case REQUEST_DELETE_GRANT_OFFERED_PERMISSIONS: {
      return {...state
      };
    }
    case COMPLETE_DELETE_GRANT_OFFERED_PERMISSIONS: {
      return {...state,
        grantOfferedPermissions: action.payload
      };
    }
    default:
      return state;
  }
}

export function activeAccount(state = initialState.activeAccount, action) {
  switch(action.type) {
    case ACTIVATE_ACCOUNT: {
      return {...state,
        ...action.payload
      };
    }
    case DEACTIVATE_ACCOUNT: {
      return initialState.activeAccount;
    }
    default:
      return state;
  }
}

export default {
  grantPermissions,
  receivedPermissionOffers,
  activePermissions,
  grantOfferedPermissions,
  activeAccount
};
