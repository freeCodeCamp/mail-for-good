const SubscriberModel = require('../../models').subscriber;

module.exports = function(req, res) {
    /* Example file
        { fieldname: 'csv',
          originalname: 'big.csv',
          encoding: '7bit',
          mimetype: 'text/csv',
          destination: 'uploads/',
          filename: '50b2376243290582bb1583caaab5d217',
          path: 'server/uploads/50b2376243290582bb1583caaab5d217',
          size: 50173280
        }
    */
    const file = req.file;

    

    res.send({});
}
