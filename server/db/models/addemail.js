const mongoose = require('mongoose');

const Subscriber = new mongoose.Schema({
  email: {type: String, default: ''},
  customData: []
});

module.exports = mongoose.model('Subscriber', Subscriber);
