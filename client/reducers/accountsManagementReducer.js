import initialState from './initialState';
import {
  REQUEST_POST_CREATE_NEW_USER, COMPLETE_POST_CREATE_NEW_USER,
  REQUEST_DELETE_USER, COMPLETE_DELETE_USER,
} from '../constants/actionTypes';

export function createAccount(state = initialState.createAccount, action) {
  switch(action.type) {
    case REQUEST_POST_CREATE_NEW_USER: {
      return {...state,
        isGetting:true
      };
    }
    case COMPLETE_POST_CREATE_NEW_USER: {
      return {...state,
        isGetting:false
      };
    }
    default:
      return state;
  }
}

export function deleteAccount(state = initialState.deleteAccount, action) {
  switch(action.type) {
    case REQUEST_DELETE_USER: {
      return {...state,
        isGetting:true
      };
    }
    case COMPLETE_DELETE_USER: {
      return {...state,
        isGetting:false
      };
    }
    default:
      return state;
  }
}

export default {
  createAccount,
  deleteAccount
};
