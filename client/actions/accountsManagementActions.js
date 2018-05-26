import {
  REQUEST_POST_CREATE_NEW_USER, COMPLETE_POST_CREATE_NEW_USER,
  REQUEST_DELETE_USER, COMPLETE_DELETE_USER,
} from '../constants/actionTypes';
import {
  API_CREATE_USER_ENDPOINT,
  API_DELETE_USER_ENDPOINT,
} from '../constants/endpoints';
import axios from 'axios';
import cookie from 'react-cookie';
import { notify } from './notificationActions';

// REST for granting permissions
export function requestPostCreateNewUser() {
  return { type: REQUEST_POST_CREATE_NEW_USER };
}
export function completePostCreateNewUser() {
  return { type: COMPLETE_POST_CREATE_NEW_USER };
}
export function requestDeleteUser() {
  return { type: REQUEST_DELETE_USER };
}
export function completeDeleteUser() {
  return { type: COMPLETE_DELETE_USER };
}


export function postCreateNewUser(newUserData) {
  return dispatch =>{
    dispatch(requestPostCreateNewUser());
    axios.post(API_CREATE_USER_ENDPOINT,{
      data:newUserData
    }).then(response => {
      dispatch(notify({ message: 'User successfully created',colour:'green'}));
      dispatch(completePostCreateNewUser());
    }).catch(error => {
      console.log('error',error);
      let errorMessage = error.response.data ? ' : '+error.response.data : ''
      dispatch(notify({ message: 'Couldn\'t create new user'+errorMessage}));
      dispatch(completePostCreateNewUser());
    })
  }
}

export function deleteUser(userData) {
  return dispatch =>{
    dispatch(requestDeleteUser());
    axios.delete(API_DELETE_USER_ENDPOINT,{
      data:userData
    }).then(response => {
      dispatch(notify({ message: 'User successfully deleted',colour:'green'}));
      dispatch(completeDeleteUser());
    }).catch(error => {
      console.log('error',error);
      let errorMessage = error.response.data ? ' : '+error.response.data : ''
      dispatch(notify({ message: 'Couldn\'t delete user'+errorMessage}));
      dispatch(completePostCreateNewUser());
    })
m  }
}
