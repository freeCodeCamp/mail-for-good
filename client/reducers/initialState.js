const initialState = {
  createCampaign: {
    isPosting: false // Posting a new campaign?
  },
  manageCampaign: {
    campaigns: [], // Array of objects for campaigns
    isGetting: false // Getting campaigns?
  },
  sendCampaign: {
    isPosting: false
  },
  createList: {
    list: [],
    isPosting: false // Posting a file?
  },
  manageList: {
    lists: [], // Array of objects for lists
    isGetting: false // Getting lists?
  },
  settings: {
    loading: false
  },
  notifications: {
    stack: []
  }
};

export default initialState;
