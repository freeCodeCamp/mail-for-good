// Test actions not indirectly tested in reducers
import { expect } from 'chai';

import {  
  getBooleanForAssignedSettings,
  changeSettings
} from './settingsActions';

describe('(Actions) settings', () => {

  it('should exist', () => {
    expect(getBooleanForAssignedSettings).to.be.a('function');
    expect(changeSettings).to.be.a('function');
  });

});