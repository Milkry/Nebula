const mongoose = require('mongoose');

module.exports = mongoose.model('Users', new mongoose.Schema({
    _id: { type: String },
    user: {
        username: { type: String },
        discriminator: { type: Number }
    },
    settings: {
        multiple: { type: Boolean, default: false }
    }
}));