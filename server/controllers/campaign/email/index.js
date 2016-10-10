const amazonController = require('./amazon-ses/controller');
const amazonValidate = require('./amazon-ses/amazon');
const amazon = require('./amazon-ses/amazon');
//const amazonSingle = require('./amazon-ses/amazon-single');
//const amazonSingleTest = require('./amazon-ses/amazon-single-test');

//const singleTest = require('./test-internal/test-single');
//const multipleTest = require('./test-internal/test-multiple');

module.exports = {
  amazon: {
    email: amazon,
    controller: amazonController,
    validate: amazonValidate
  }
};
