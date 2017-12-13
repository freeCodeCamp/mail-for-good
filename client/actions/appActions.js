import io from 'socket.io-client';
import {
  REQUEST_WS_PROFILE,
  COMPLETE_WS_PROFILE,
  RECEIVE_WS_NOTIFICATION,
  CONSUME_WS_NOTIFICATION,
} from '../constants/actionTypes';
import { getCampaigns } from '../actions/campaignActions';
import { getLists } from '../actions/listActions';

export function requestProfile() {
  return { type: REQUEST_WS_PROFILE };
}

export function completeProfile(data) {
  return { type: COMPLETE_WS_PROFILE, user: data };
}

export function receiveNotification(notification) {
  return dispatch => {
    if (notification.newDataToFetch == 'campaigns') {
      dispatch(getCampaigns());
    } else if (notification.newDataToFetch == 'lists') {
      dispatch(getLists());
    }

    dispatch({ type: RECEIVE_WS_NOTIFICATION, notification });
  };
}

export function consumeNotification(index) {
  return { type: CONSUME_WS_NOTIFICATION, index };
}

export function emitProfileRequest() {
  return dispatch => {
    const socket = io();
    socket.emit('login');

    socket.on('loginResponse', data => {
      dispatch(completeProfile(data));
    });

    socket.on('notification', notification => {
      dispatch(receiveNotification(notification));
    });
  };
}

export function localNotification(notification) {
  // Dispatches a notifcation in the top right in the same manner as with WS

  return dispatch => {
    dispatch(receiveNotification(notification));
  };
}
