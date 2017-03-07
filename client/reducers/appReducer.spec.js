import { expect } from 'chai';

import {
  requestProfile,
  completeProfile,
  receiveNotification,
  consumeNotification
} from '../actions/appActions';

import initialState from './initialState';
import { profile } from './appReducer';

describe('(Reducer/Action Creator) app', () => {

// profile reducer

  it('should handle REQUEST_WS_PROFILE', () => {
    expect(
      profile(undefined, requestProfile())
    ).to.deep.equal({
      ...initialState.profile
    });
  });

  it('should handle COMPLETE_WS_PROFILE', () => {
    const mockData = { something: 'something' };
    expect(
      profile(undefined, completeProfile(mockData))
    ).to.deep.equal({ 
      ...initialState.profile,
      user: { ...mockData }
    });
  });

  // it('should handle RECEIVE_WS_NOTIFICATION', () => {}):

  // it('should handle CONSUME_WS_NOTIFICATION', () => {});

});