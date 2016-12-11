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
    isPosting: false,
    upload: null // int 0-100 regarding % completion of CSV upload
  },
  manageList: {
    lists: [], // Array of objects for lists
    isGetting: false // Getting lists?
  },
  manageListSubscribers: {
    listId: null,
    subscribers: [],
    isGetting: false,
    additionalFields: [],
    totalListSubscribers: 0
  },
  settings: {
    loading: false,
    fieldsExist: {}
  },
  notifications: { // Internal notifcations for things such as errors on importing CSV files and so forth
    stack: []
  },
  profile: {
    user: {},
    ws_notification: []
  },
  offerPermission: { // Refers to GrantPermissions container
    isPosting: false,
    response: {}
  },
  receivedPermissionOffers: { // Permission offers received from another user
    isGetting: false,
    receivedPermissionOffers: []
  }
};

export default initialState;
