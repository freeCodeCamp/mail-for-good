import initialState from './initialState';
import {
    COMPLETE_ADD_SUBSCRIBERS,
    REQUEST_ADD_SUBSCRIBERS
} from '../constants/actionTypes';

export default function test(state = initialState.subscribers, action) {
    switch (action.type) {
        case REQUEST_ADD_SUBSCRIBERS: {
                return {...state,
                    isAdding: true
                }
            }
        case COMPLETE_ADD_SUBSCRIBERS: {
                return {...state,
                    isAdding: false
                }
            }
        default:
            return state;
    }
}
