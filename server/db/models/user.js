const mongoose = require('mongoose');

// TODO: Flesh out the user model with any other relevant data.

const User = new mongoose.Schema({
    google: {
      name: { type: String, default: '' },
      email: { type: String, unique: true, lowercase: true },
      picture: { type: String, default: '' },
      id: {},
      token: { type: String, default: '' }
    }
});

module.exports = mongoose.model('User', User);
