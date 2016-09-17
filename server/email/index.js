const amazonSingle = require('./amazon-ses/amazon-single');
const amazonSingleTest = require('./amazon-ses/amazon-single-test');

module.exports = {
    amazon: {
        single: amazonSingle,
        testSingle: amazonSingleTest
    }
};
