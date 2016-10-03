import { COMPLETE_ADD_SUBSCRIBERS, REQUEST_ADD_SUBSCRIBERS } from '../constants/actionTypes'; import { API_SUBSCRIBERS_ENDPOINT, API_IMPORTCSV_ENDPOINT } from '../constants/endpoints';

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

export function submitCSV(file) {
  return function (dispatch) {
    dispatch(requestAddSubscribers());

    const formData = new FormData();
    formData.append('csv', file);

    const xhr = new XMLHttpRequest();

    xhr.open('POST', API_IMPORTCSV_ENDPOINT, true);

    xhr.onreadystatechange = () => {
        switch (xhr.readyState) {
            case 3: { // Loading

            }
            case 4: { // Done
                dispatch(completeAddSubscribers());
            }
        }

    };

    xhr.send(formData);
  };
}
