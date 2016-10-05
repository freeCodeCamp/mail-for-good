import initialState from './initialState';
import {
    COMPLETE_ADD_SUBSCRIBERS,
    REQUEST_ADD_SUBSCRIBERS,

    REQUEST_GET_LISTS,
    COMPLETE_GET_LISTS
} from '../constants/actionTypes';

export function createList(state = initialState.createList, action) {
    switch (action.type) {
        case REQUEST_ADD_SUBSCRIBERS: {
                return {...state,
                    isAdding: true
                };
            }
        case COMPLETE_ADD_SUBSCRIBERS: {
                return {...state,
                    isAdding: false
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
