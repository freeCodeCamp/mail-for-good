// Test actions not indirectly tested in reducers
import { expect } from 'chai';

import {  
  emitProfileRequest,
  localNotification
} from './appActions';

describe('(Actions) app', () => {

  it('should exist', () => {
    expect(emitProfileRequest).to.be.a('function');
    expect(localNotification).to.be.a('function');
  });

});