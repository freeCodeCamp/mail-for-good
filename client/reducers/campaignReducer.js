import initialState from './initialState';
import { REQUEST_POST_CREATECAMPAIGN, COMPLETE_POST_CREATECAMPAIGN, REQUEST_GET_CAMPAIGNS, COMPLETE_GET_CAMPAIGNS } from '../constants/actionTypes';

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

export function manageCampaign(state = initialState.manageCampaign, action) {
  switch (action.type) {
    case REQUEST_GET_CAMPAIGNS: {
        return {...state,
          isGetting: true
        };
    }
    case COMPLETE_GET_CAMPAIGNS: {
        return {...state,
          campaigns: action.campaigns,
          isGetting: false
        };
    }
    default:
      return state;
  }
}

export default {
  createCampaign,
  manageCampaign
};
