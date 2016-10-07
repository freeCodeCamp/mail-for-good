const amazonSingle = require('./amazon-ses/amazon-single');
const amazonSingleTest = require('./amazon-ses/amazon-single-test');

const singleTest = require('./test-internal/test-single');
const multipleTest = require('./test-internal/test-multiple');

module.exports = {
  amazon: {
    single: amazonSingle,
    testSingle: amazonSingleTest
  },
  internal: {
    single: singleTest,
    multiple: multipleTest
  }
};
