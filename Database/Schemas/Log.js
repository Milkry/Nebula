const mongoose = require('mongoose');

module.exports = mongoose.model('Logs', new mongoose.Schema({
    command: { type: String },
    executor: {
        id: { type: String },
        name: { type: String }
    },
    guild: {
        id: { type: String },
        name: { type: String },
        channel: { type: String }
    },
    date: { type: Number, default: Math.floor(Date.now() / 1000) },
}));