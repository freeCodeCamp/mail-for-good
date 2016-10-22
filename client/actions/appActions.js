import io from 'socket.io-client';
import {
  REQUEST_WS_PROFILE,
  COMPLETE_WS_PROFILE
} from '../constants/actionTypes';

export function requestProfile() {
  return { type: REQUEST_WS_PROFILE };
}

export function completeProfile(data) {
  return { type: COMPLETE_WS_PROFILE, user: data };
}

export function emitProfileRequest() {
  return dispatch => {
    const socket = io();
    socket.emit('login');

    socket.on('loginResponse', data => {
      dispatch(completeProfile(data));
    });
  };
}
