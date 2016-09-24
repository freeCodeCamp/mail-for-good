import axios from 'axios';
import { SETTINGS_CHANGE_RECEIVE, SETTINGS_CHANGE_REQUEST } from '../constants/actionTypes';
import { API_SETTINGS_ENDPOINT } from '../constants/endpoints';


export function requestChangeSettings() {
  return {
    type: SETTINGS_CHANGE_REQUEST
  };
}

export function receiveChangeSettings(status) {
  return {
    type: SETTINGS_CHANGE_RECEIVE,
    payload: {
      status
    }
  };
}

export function changeSettings(newSettings) {
  return function (dispatch) {
    dispatch(requestChangeSettings());
    
    axios.post(API_SETTINGS_ENDPOINT, newSettings)
      .then(() => {
        dispatch(receiveChangeSettings('success'))
        // error /success handling
      })
      .catch(() => {
        dispatch(receiveChangeSettings('error updating settings'));
      })
    ;
  };
}
