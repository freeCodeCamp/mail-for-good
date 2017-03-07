import { expect } from 'chai';

import {
  requestChangeSettings,
  receiveChangeSettings,
  updateSettingsFieldsExist
} from '../actions/settingsActions';

import initialState from './initialState';

import settings from './settingsReducer';

describe('(Reducer/Action Creator) settings', () => {

// settings reducer

  it('should handle SETTINGS_CHANGE_REQUEST', () => {
    expect(
      settings(undefined, requestChangeSettings())
    ).to.deep.equal({
      ...initialState.settings,
      loading: true
    });
  });

  it('should handle SETTINGS_CHANGE_RECEIVE', () => {
    const mockStatus = { something: 'something' };
    expect(
      settings(undefined, receiveChangeSettings(mockStatus))
    ).to.deep.equal({
      ...initialState.settings,
      loading: false,
      status: ''
    });
  });

  it('should handle SETTINGS_UPDATE_FIELDS_EXIST', () => {
    const mockPayload = 'something';
    expect(
      settings(undefined, updateSettingsFieldsExist(mockPayload))
    ).to.deep.equal({
      ...initialState.settings,
      fieldsExist: mockPayload
    });
  });

});