const bodyParser = require('body-parser');
const parseJson = bodyParser.json();

const createUser = require('../controllers/accountsManagement/create-user');
const deleteUser = require('../controllers/accountsManagement/delete-user');

// Middleware
const { apiIsAuth } = require('./middleware/auth');

module.exports = function(app) {
  app.post('/api/create-user', apiIsAuth, parseJson, (req, res) => {
    createUser(req,res);
  })

  app.delete('/api/delete-user', apiIsAuth, parseJson, (req,res) => {
    deleteUser(req,res)
  });
};
