const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    amazonSimpleEmailServiceAccessKey: { type: String, default: '' },
    amazonSimpleEmailServiceSecretKey: { type: String, default: '' }
});

module.exports = mongoose.model('Settings', settingsSchema);
