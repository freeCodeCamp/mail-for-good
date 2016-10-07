import {REQUEST_ADD_SUBSCRIBERS, COMPLETE_ADD_SUBSCRIBERS, REQUEST_GET_LISTS, COMPLETE_GET_LISTS} from '../constants/actionTypes';
import {API_SUBSCRIBERS_ENDPOINT, API_IMPORTCSV_ENDPOINT, API_MANAGELIST_ENDPOINT} from '../constants/endpoints';

export function requestAddSubscribers() {
  return {type: REQUEST_ADD_SUBSCRIBERS};
}

export function completeAddSubscribers() {
  return {type: COMPLETE_ADD_SUBSCRIBERS};
}

export function requestGetList() {
  return {type: REQUEST_GET_LISTS};
}

export function completeGetList(lists) {
  return {type: COMPLETE_GET_LISTS, lists};
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
        case 3:
          { // Loading

          }
        case 4:
          { // Done
            dispatch(completeAddSubscribers());
          }
      }

    };

    xhr.send(formData);
  };
}

export function getLists() {
  return dispatch => {
    dispatch(requestGetList());
    const xhr = new XMLHttpRequest();
    xhr.open('GET', API_MANAGELIST_ENDPOINT);
    xhr.onload = () => {
      // Convert response from JSON
      const listsArray = JSON.parse(xhr.responseText);
      dispatch(completeGetList(listsArray));
    }
    xhr.send();
  }
}
