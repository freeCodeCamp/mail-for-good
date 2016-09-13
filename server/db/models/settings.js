const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    amazonSimpleEmailService: {
        accessKey: { type: String, default: '' },
        secretKey: { type: String, default: '' }
    }
});

module.exports = mongoose.model('Settings', settingsSchema);
