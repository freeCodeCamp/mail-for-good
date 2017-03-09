import { expect } from 'chai';

import {
  requestGetListSubscribers,
  completeGetListSubscribers,
  completeDeleteListSubscribers,
  requestAddSubscribers,
  completeAddSubscribers,
  requestGetList,
  completeGetList,
  completeDeleteLists
} from '../actions/listActions';

import initialState from './initialState';

import {
  manageListSubscribers,
  createList,
  manageList,
 } from './listReducer';

describe('(Reducer/Action Creator) list', () => {

// manageListSubscribers reducer

  it('should handle REQUEST_GET_LIST_SUBSCRIBERS', () => {
    const mockListId = 'something';
    expect(
      manageListSubscribers(undefined, requestGetListSubscribers(mockListId))
    ).to.deep.equal({
      ...initialState.manageListSubscribers,
      isGetting: true,
      listId: mockListId
    });
  });

  it('should handle COMPLETE_GET_LIST_SUBSCRIBERS', () => {
    const mockSubscribers = 'something1';
    const mockTotalListSubscribers = 'something2';
    const mockAdditionalFields = 'something3';
    expect(
      manageListSubscribers(undefined, completeGetListSubscribers(mockSubscribers, mockTotalListSubscribers, mockAdditionalFields))
    ).to.deep.equal({
      ...initialState.manageListSubscribers,
      isGetting: false,
      subscribers: mockSubscribers,
      totalListSubscribers: mockTotalListSubscribers,
      additionalFields: mockAdditionalFields
    });
  });

  it('should handle COMPLETE_DELETE_LIST_SUBSCRIBERS', () => {
    const mockSubscribers = 'something';
    expect(
      manageListSubscribers(undefined, completeDeleteListSubscribers(mockSubscribers))
    ).to.deep.equal({
      ...initialState.manageListSubscribers,
      subscribers: mockSubscribers
    });
  });

// createList reducer

  it('should handle REQUEST_ADD_SUBSCRIBERS', () => {
    const mockUpload = 'something';
    expect(
      createList(undefined, requestAddSubscribers(mockUpload))
    ).to.deep.equal({
      ...initialState.createList,
      isPosting: true,
      upload: mockUpload
    });
  });

  it('should handle COMPLETE_ADD_SUBSCRIBERS', () => {
    expect(
      createList(undefined, completeAddSubscribers())
    ).to.deep.equal({
      ...initialState.createList,
      isPosting: false,
      upload: null
    });
  });

// manageList reducer

  it('should handle REQUEST_GET_LISTS', () => {
    expect(
      manageList(undefined, requestGetList())
    ).to.deep.equal({
      ...initialState.manageList,
      isGetting: true
    });
  });

  it('should handle COMPLETE_GET_LISTS', () => {
    const mockLists = 'something';
    expect(
      manageList(undefined, completeGetList(mockLists))
    ).to.deep.equal({
      ...initialState.manageList,
      lists: mockLists,
      isGetting: false
    });
  });

  it('should handle COMPLETE_DELETE_LISTS', () => {
    const mockLists = 'something';
    expect(
      manageList(undefined, completeDeleteLists(mockLists))
    ).to.deep.equal({
      ...initialState.manageList,
      lists: mockLists
    });
  });

});