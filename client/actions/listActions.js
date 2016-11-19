import axios from 'axios';
import {
  API_IMPORTCSV_ENDPOINT,
  API_MANAGELIST_ENDPOINT,
  API_LISTSUBSCRIBERS_ENDPOINT
} from '../constants/endpoints';
import {
  REQUEST_ADD_SUBSCRIBERS, COMPLETE_ADD_SUBSCRIBERS,
  REQUEST_GET_LISTS, COMPLETE_GET_LISTS,
  REQUEST_GET_LIST_SUBSCRIBERS, COMPLETE_GET_LIST_SUBSCRIBERS,
  COMPLETE_DELETE_LIST_SUBSCRIBERS
} from '../constants/actionTypes';
import { notify } from '../actions/notificationActions';

export function requestAddSubscribers() {
  return { type: REQUEST_ADD_SUBSCRIBERS };
}

export function completeAddSubscribers() {
  return { type: COMPLETE_ADD_SUBSCRIBERS };
}

export function requestGetList() {
  return { type: REQUEST_GET_LISTS };
}

export function completeGetList(lists) {
  return { type: COMPLETE_GET_LISTS, lists };
}

export function requestGetListSubscribers(listId) {
  return { type: REQUEST_GET_LIST_SUBSCRIBERS, listId };
}

export function completeGetListSubscribers(subscribers) {
  return { type: COMPLETE_GET_LIST_SUBSCRIBERS, subscribers };
}

export function completeDeleteListSubscribers(lists) {
  return { type: COMPLETE_DELETE_LIST_SUBSCRIBERS, lists };
}

export function deleteListSubscribers(listSubscribers, subscribers) {
  return dispatch => {
    axios.delete(API_LISTSUBSCRIBERS_ENDPOINT, {
      data: { listSubscribers }
    }).then(response => {
      dispatch(notify({ message: 'Subscribers(s) deleted', colour: 'green' }));
      // Remove deleted listSubscribers from state
      const filterLists = subscribers.filter(sub => ~subscribers.indexOf(sub.id));
      dispatch(completeDeleteListSubscribers(filterLists));
    }).catch(err => {
      dispatch(notify({ message: 'An error occurred when deleting this email' }));
    });
  };
}

export function getListSubscribers(listId) {
  return dispatch => {
    dispatch(requestGetListSubscribers(listId));

    axios.get(API_LISTSUBSCRIBERS_ENDPOINT, {
      params: { listId }
    })
      .then(response => {
        dispatch(completeGetListSubscribers(response.data.subscribers));
      })
      .catch(response => {
        dispatch(completeGetListSubscribers([]));
        dispatch(notify({ message: response.message }));
      });
  };
}

export function getLists() {
  return dispatch => {
    dispatch(requestGetList());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_MANAGELIST_ENDPOINT);
    xhr.onload = () => {
      if (xhr.responseText) {
        // Convert response from JSON
        const listsArray = JSON.parse(xhr.responseText);
        dispatch(completeGetList(listsArray));
      } else {
        dispatch(completeGetList([]));
      }

    };
    xhr.send();
  };
}

export function submitCSV(file, headers, list) {
  return dispatch => {
    dispatch(requestAddSubscribers());

    const formData = new FormData();
    formData.append('csv', file);
    formData.append('headers', JSON.stringify(headers));
    formData.append('list', list);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', API_IMPORTCSV_ENDPOINT);

    xhr.onreadystatechange = () => {
      switch (xhr.readyState) {
        case 4: { // Done
            dispatch(completeAddSubscribers());
            // Update lists so that the user can see the new list under manage lists
            dispatch(getLists());
        }
      }

    };

    xhr.send(formData);
  };
}
