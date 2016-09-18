import axios from 'axios';
import { COMPLETE_ADD_SUBSCRIBERS, REQUEST_ADD_SUBSCRIBERS } from '../constants/actionTypes'; import { API_SUBSCRIBERS_ENDPOINT } from '../constants/endpoints';


export function requestAddSubscribers() {
  return {
    type: REQUEST_ADD_SUBSCRIBERS
  };
}

export function completeAddSubscribers() {
  return {
    type: COMPLETE_ADD_SUBSCRIBERS
  };
}

export function addSubscribers(subscribers, fields) {
  return function (dispatch) {
    dispatch(requestAddSubscribers());
    
    console.log({subscribers, fields});
    axios.post(API_SUBSCRIBERS_ENDPOINT, { subscribers, fields })
      .then(() => {
        // error /success handling
      });
  };
}
