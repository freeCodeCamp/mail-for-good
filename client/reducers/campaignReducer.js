import initialState from './initialState';
import { REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN } from '../constants/actionTypes';

export function createCampaign(state = initialState.createCampaign, action) {
  switch (action.type) {
    case REQUEST_POST_CREATECAMPAIGN: {
        return {...state,
          isPosting: true
        };
    }
    case COMPLETE_POST_CREATECAMPAIGN: {
        return {...state,
          isPosting: false
        };
    }
    default:
      return state;
  }
}

export default {
  createCampaign
};
