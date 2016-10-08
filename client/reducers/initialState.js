const initialState = {
  createCampaign: {
    isPosting: false // Posting a new campaign?
  },
  manageCampaign: {
    campaigns: [], // Array of objects for campaigns
    isGetting: false // Getting campaigns?
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
  }
};

export default initialState;
