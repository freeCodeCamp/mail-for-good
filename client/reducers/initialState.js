const initialState = {
  createCampaign: {
    isPosting: false // Posting a new campaign?
  },
  createTemplate: {
    isPosting: false // Posting a new template?
  },
  manageCampaign: {
    campaigns: [], // Array of objects for campaigns
    isGetting: false // Getting campaigns?
  },
  sendCampaign: {
    isPosting: false,
    sendCampaignResponse: '',
    sendCampaignStatus: 0
  },
  createList: {
    list: [],
    isPosting: false // Posting a file?
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
