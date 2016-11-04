const initialState = {
  createCampaign: {
    isPosting: false // Posting a new campaign?
  },
  createTemplate: {
    isPosting: false
  },
  manageCampaign: {
    campaigns: [], // Array of objects for campaigns
    isGetting: false // Getting campaigns?
  },
  manageTemplates: {
    templates: [],
    isGetting: false
  },
  sendCampaign: {
    isPosting: false,
    sendCampaignResponse: '',
    sendCampaignStatus: 0
  },
  createList: {
    list: [],
    isPosting: false
  },
  manageList: {
    lists: [], // Array of objects for lists
    isGetting: false // Getting lists?
  },
  manageListSubscribers: {
    listId: null,
    subscribers: [],
    isGetting: false
  },
  settings: {
    loading: false
  },
  notifications: { // Internal notifcations for things such as errors on importing CSV files and so forth
    stack: []
  },
  profile: {
    user: {},
    ws_notification: []
  }
};

export default initialState;
