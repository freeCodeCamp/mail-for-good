// Test actions not indirectly tested in reducers
import { expect } from 'chai';

import {  
  getListSubscribers,
  getLists,
  submitCSV,
  deleteListSubscribers,
  deleteLists
} from './listActions';

describe('(Actions) list', () => {

  it('should exist', () => {
    expect(getListSubscribers).to.be.a('function');
    expect(getLists).to.be.a('function');
    expect(submitCSV).to.be.a('function');
    expect(deleteListSubscribers).to.be.a('function');
    expect(deleteLists).to.be.a('function');
  });

});