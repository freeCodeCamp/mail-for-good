import axios from 'axios';
import {
  API_IMPORTCSV_ENDPOINT,
  API_MANAGELIST_ENDPOINT,
  API_LISTSUBSCRIBERS_ENDPOINT,
  API_LIST_ENDPOINT
} from '../constants/endpoints';
import {
  REQUEST_ADD_SUBSCRIBERS, COMPLETE_ADD_SUBSCRIBERS,
  REQUEST_GET_LISTS, COMPLETE_GET_LISTS,
  REQUEST_GET_LIST_SUBSCRIBERS, COMPLETE_GET_LIST_SUBSCRIBERS,
  COMPLETE_DELETE_LIST_SUBSCRIBERS, COMPLETE_DELETE_LISTS,
  COMPLETE_EDIT_LIST_NAME
} from '../constants/actionTypes';
import { notify } from '../actions/notificationActions';
import { localNotification } from './appActions';

export function requestAddSubscribers(upload) {
  return { type: REQUEST_ADD_SUBSCRIBERS, upload };
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

export function completeGetListSubscribers(subscribers, totalListSubscribers, additionalFields ) {
  return { type: COMPLETE_GET_LIST_SUBSCRIBERS, subscribers, totalListSubscribers, additionalFields };
}

export function completeDeleteListSubscribers(subscribers) {
  return { type: COMPLETE_DELETE_LIST_SUBSCRIBERS, subscribers };
}

export function completeDeleteLists(lists) {
  return { type: COMPLETE_DELETE_LISTS, lists };
}

export function completeEditListName(lists) {
  return { type: COMPLETE_EDIT_LIST_NAME, lists};
}

export function getListSubscribers(listId, offset=1, limit=10, filters={}) {
  return dispatch => {
    dispatch(requestGetListSubscribers(listId));

    axios.get(API_LISTSUBSCRIBERS_ENDPOINT, {
      params: { listId, offset, limit, filters },
      responseType: 'json',
    })
      .then(response => {
        dispatch(completeGetListSubscribers(response.data.subscribers, response.data.total, response.data.additionalFields));
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
    xhr.setRequestHeader('Accept', 'application/json, text/javascript');
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
    dispatch(requestAddSubscribers(0));

    const crudeRandomId = (Math.random() * 100000).toString();

    const formData = new FormData();
    formData.append('csv', file);
    formData.append('headers', JSON.stringify(headers));
    formData.append('list', list);

    let percentComplete = 0;
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", e => {
      if (e.lengthComputable) {
        percentComplete = Math.round((e.loaded * 100) / e.total);
        dispatch(
          localNotification({
            isUpdate: true,
            message: `Uploading CSV... ${percentComplete}%`,
            id: crudeRandomId,
            icon: 'fa-upload',
            iconColour: 'text-blue'
          })
        );
        dispatch(requestAddSubscribers(percentComplete));
      }
    }, false);

    xhr.upload.addEventListener("load", () => {
      dispatch(completeAddSubscribers());
      // Update lists so that the user can see the new list under manage lists
      dispatch(getLists());
    }, false);

    xhr.open('POST', API_IMPORTCSV_ENDPOINT);
    xhr.send(formData);
  };
}

export function deleteListSubscribers(listSubscriberIds, subscribers) {
  return dispatch => {
    axios.delete(API_LISTSUBSCRIBERS_ENDPOINT, {
      data: { listSubscribers: listSubscriberIds }
    }).then(response => {
      dispatch(notify({ message: response.data, colour: 'green' }));
      // Remove deleted listSubscribers from state
      const filterListSubscribers = subscribers.filter(sub => !~listSubscriberIds.indexOf(sub.id));
      dispatch(completeDeleteListSubscribers(filterListSubscribers));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
    });
  };
}

export function deleteLists(listIds, lists) {
  return dispatch => {
    axios.delete(API_MANAGELIST_ENDPOINT, {
      data: { lists: listIds }
    }).then(response => {
      dispatch(notify({ message: response.data, colour: 'green' }));
      // Remove deleted lists from state
      const filterLists = lists.filter(list => !~listIds.indexOf(list.id));
      dispatch(completeDeleteLists(filterLists));
    }).catch(() => {
      dispatch(notify({ message: 'There was an error completing this request.' }));
    });
  };
}

export function editListName(listId, newName, lists) {
  return dispatch => {
      axios.patch(API_LIST_ENDPOINT, {id: listId ,values: {name: newName}}
      ).then(response => {
        //create an updated version of the lists
        const newLists = lists.map((list)=>{
          if(list.id === listId){
            return Object.assign({},list,{name:newName});
          }else{
            return list;
          }
        });
        //update the lists
        dispatch(completeEditListName(newLists));

        dispatch(notify({message: response.data, colour: 'green'}));
      }).catch(() => {
        dispatch(notify({message: 'There was an error editing this list'}));
      });
  };
}
