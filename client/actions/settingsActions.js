import axios from 'axios';
import { SETTINGS_CHANGE_RECEIVE, SETTINGS_CHANGE_REQUEST, SETTINGS_UPDATE_FIELDS_EXIST } from '../constants/actionTypes';
import { API_SETTINGS_ENDPOINT } from '../constants/endpoints';
import { notify } from '../actions/notificationActions';

export function requestChangeSettings() {
  return {type: SETTINGS_CHANGE_REQUEST};
}

export function receiveChangeSettings(status) {
  return {type: SETTINGS_CHANGE_RECEIVE, payload: {
    status: status.error ? status.message : ''
  }};
}

export function updateSettingsFieldsExist(fields) {
  return {type: SETTINGS_UPDATE_FIELDS_EXIST, payload: fields };
}

export function getBooleanForAssignedSettings(notification) {
  return dispatch => {
    axios.get(API_SETTINGS_ENDPOINT, {
      responseType: 'json',
    })
    .then(res => {
      if (notification) {
        dispatch(notify(notification));
      }
      dispatch(updateSettingsFieldsExist(res.data));
    });
  };
}

export function changeSettings(newSettings) {
  return function(dispatch) {
    dispatch(requestChangeSettings());

    axios.post(API_SETTINGS_ENDPOINT, newSettings).then(() => {
      dispatch(receiveChangeSettings({message: 'Settings updated', error: false}));
      dispatch(getBooleanForAssignedSettings({message: 'Settings updated', colour: 'green'}));
    }).catch(res => {
      dispatch(receiveChangeSettings({message: res.response.data.message, error: true}));
      dispatch(getBooleanForAssignedSettings({message: res.response.data.message, colour: 'red'}));
    });
  };
}
