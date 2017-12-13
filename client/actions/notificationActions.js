import { RECEIVE_NOTIFICATION, CONSUME_NOTIFICATION } from '../constants/actionTypes';

export function notify(notification) {
  return {
    type: RECEIVE_NOTIFICATION,
    notification: {
      message: notification.message,
      dismissAfter: 20000,
      isActive: true,
      activeBarStyle: {
        background: notification.colour === 'green' ? 'green' : 'crimson',
        left: ''
      }
  }};
}

export function consume() {
  return { type: CONSUME_NOTIFICATION };
}
