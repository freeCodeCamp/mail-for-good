const amazonController = require('./amazon-ses/controller');
const amazonValidate = require('./amazon-ses/amazon');
const amazon = require('./amazon-ses/amazon');

module.exports = {
  amazon: {
    email: amazon,
    controller: amazonController,
    validate: amazonValidate
  }
};
