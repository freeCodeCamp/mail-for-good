import initialState from './initialState';
import { SETTINGS_CHANGE_RECEIVE, SETTINGS_CHANGE_REQUEST, SETTINGS_UPDATE_FIELDS_EXIST } from '../constants/actionTypes';


export default function settings(state = initialState.settings, action) {
  switch (action.type) {
    case SETTINGS_CHANGE_REQUEST: {
      return {...state,
        loading: true
      };
    }
    case SETTINGS_CHANGE_RECEIVE: {
      return {...state,
        loading: false,
        status: action.payload.status
      };
    }
    case SETTINGS_UPDATE_FIELDS_EXIST: {
      return {...state,
        fieldsExist: action.payload
      };
    }
    default:
      return state;
  }
}
