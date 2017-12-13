const bodyParser = require('body-parser');
const multer = require('multer')({ dest: 'server/controllers/list/uploads/' });
const parseJson = bodyParser.json();
const cookieParser = require('cookie-parser')();

// List controllers
const getLists = require('../controllers/list/get-lists');
const getListSubscribers = require('../controllers/list/get-list-subscribers');
const exportListSubscribersCSV = require('../controllers/list/export-list-subscribers-csv');
const addSubscribers = require('../controllers/list/add-subscribers');
const importCSV = require('../controllers/list/import-csv');
const subscribeToList = require('../controllers/list/subscribe');
const deleteSubscribers = require('../controllers/list/delete-subscribers');
const deleteLists = require('../controllers/list/delete-lists');
const updateList = require('../controllers/list/update-list');

// Middleware
const { apiIsAuth } = require('./middleware/auth');
const { writeAccess, readAccess } = require('./middleware/acl');

// Permission
const listPermission = require('../controllers/permissions/acl-lib/acl-list-permissions');

// Higher order functions decorating with the permission type
const writeListAccess = (req, res, next) => writeAccess(req, res, next, listPermission);
const readListAccess = (req, res, next) => readAccess(req, res, next, listPermission);

module.exports = function(app, io) {
  // Get all lists
  app.get('/api/list/manage', apiIsAuth, cookieParser, readListAccess, (req, res) => {
    getLists(req, res);
  });
  // Get all subscribers of a list
  app.get('/api/list/subscribers', apiIsAuth, parseJson, cookieParser, readListAccess, (req, res) => {
    getListSubscribers(req, res);
  });
  // Get a single email using the list subscription key
  app.get('/api/list/subscribe', (req, res) => {
    subscribeToList(req, res);
  });
  // temp route for testing csv export of list subscribers
  app.get('/api/list/subscribers/csv', apiIsAuth, cookieParser, readListAccess, (req, res) => {
    exportListSubscribersCSV(req, res);
  });

  // Post new subscribers
  app.post('/api/list/add/subscribers', apiIsAuth, writeListAccess, (req, res) => {
    addSubscribers(req, res);
  });
  // Post new list via csv import
  app.post('/api/list/add/csv', apiIsAuth, multer.single('csv'), cookieParser, writeListAccess, (req, res) => {
    importCSV(req, res, io);
  });

  // Delete subscribers
  app.delete('/api/list/subscribers', apiIsAuth, parseJson, cookieParser, writeListAccess, (req, res) => {
    deleteSubscribers(req, res);
  });
  // Delete lists
  app.delete('/api/list/manage', apiIsAuth, parseJson, cookieParser, writeListAccess, (req, res) => {
    deleteLists(req, res);
  });

  //update a list
  app.patch('/api/list', apiIsAuth, parseJson, cookieParser, writeListAccess, (req,res) => {
    updateList(req,res);
  });
};
