const initialState = {
  createList: {
    list: [],
    isAdding: false // Uploading a file?
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
