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
  sendTest: {
    isPosting: false,
    sendTestEmailResponse: '',
    sendTestEmailStatus: 0
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
  grantPermissions: { // Refers to GrantPermissions container
    isGetting: false,
    grantedPermissions: [],
    isPosting: false,
    response: {}
  },
  createAccount: {
    isGetting: false,
    isPosting: false,
    response: {}
  },
  deleteAccount: { // Refers to DeleteAccount container
    isGetting: false,
    isPosting: false,
    response: {}
  },
  receivedPermissionOffers: { // Permission offers received from another user
    isGetting: false,
    receivedPermissionOffers: []
  },
  activePermissions: { // Permission offers active for a user (permissions they've been granted)
    isGetting: false,
    activePermissions: []
  },
  grantOfferedPermissions: { // Permission offers that have been offered to another user
    isGetting: false,
    grantOfferedPermissions: []
  },
  activeAccount: {}
};

export default initialState;
