const mongoose = require('mongoose');
const config = require("../../config.json");

module.exports = mongoose.model('Guilds', new mongoose.Schema({
    _id: { type: String },
    name: { type: String },
    prefix: { type: String, default: config.prefix },
    monitoring: { type: Boolean, default: true }
}));