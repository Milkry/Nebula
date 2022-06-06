const mongoose = require('mongoose');

module.exports = mongoose.model('Guilds', new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    monitoring: { type: Boolean, default: true }
}));