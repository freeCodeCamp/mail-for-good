import initialState from './initialState';
import {
  COMPLETE_ADD_SUBSCRIBERS, REQUEST_ADD_SUBSCRIBERS,
  REQUEST_GET_LISTS, COMPLETE_GET_LISTS,
  REQUEST_GET_LIST_SUBSCRIBERS, COMPLETE_GET_LIST_SUBSCRIBERS
} from '../constants/actionTypes';

export function manageListSubscribers(state = initialState.manageListSubscribers, action) {
  switch(action.type) {
    case REQUEST_GET_LIST_SUBSCRIBERS: {
      return {...state,
        isGetting: true,
        listId: action.listId
      };
    }
    case COMPLETE_GET_LIST_SUBSCRIBERS: {
      return {
        ...state,
        isGetting: false,
        subscribers: action.subscribers
      };
    }
    default:
      return state;
  }
}

export function createList(state = initialState.createList, action) {
  switch (action.type) {
    case REQUEST_ADD_SUBSCRIBERS: {
        return {...state,
          isPosting: true
        };
    }
    case COMPLETE_ADD_SUBSCRIBERS: {
        return {...state,
          isPosting: false
        };
    }
    default:
      return state;
  }
}

export function manageList(state = initialState.manageList, action) {
  switch (action.type) {
    case REQUEST_GET_LISTS: {
        return {...state,
          isGetting: true
        };
    }
    case COMPLETE_GET_LISTS: {
        return {...state,
          lists: action.lists,
          isGetting: false
        };
    }
    default:
      return state;
  }
}

export default {
  createList,
  manageList
};
