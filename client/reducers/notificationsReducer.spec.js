import { expect } from 'chai';

import {
  notify,
  consume
} from '../actions/notificationActions';

import initialState from './initialState';
import notifications from './notificationsReducer';

describe('(Reducer/Action Creator) notification', () => {

// notifications reducer

  it('should handle RECEIVE_NOTIFICATION', () => {
    const mockNotification = { message: 'something1', colour: 'something2'};
    const mockStackElement = {
      message: mockNotification.message,
      dismissAfter: 20000,
      isActive: true,
      activeBarStyle: {
        background: 'crimson',
        left: ''
      }
    };
    expect(
      notifications(undefined, notify(mockNotification))
    ).to.deep.equal({
      ...initialState.notifications,
      stack: [ ...initialState.notifications.stack, mockStackElement ] 
    });
  });

  it('should handle RECEIVE_NOTIFICATION', () => {
    expect(
      notifications(undefined, consume())
    ).to.deep.equal({
      ...initialState.notifications,
      stack: initialState.notifications.stack.slice(1)
    });
  });

});