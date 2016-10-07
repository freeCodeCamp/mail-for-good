const initialState = {
  createCampaign: {
    isPosting: false // Posting a new campaign?
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
  test: {
    something: true
  }
};

export default initialState;
