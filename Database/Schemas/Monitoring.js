const mongoose = require('mongoose');
const usersSchema = require('./User.js').schema;

module.exports = mongoose.model('Monitorings', new mongoose.Schema({
    _id: { type: String },
    channelName: { type: String },
    access: { type: [usersSchema], default: [] },
    active: { type: Boolean, default: true },
    busy: { type: Boolean, default: false },
    guildId: { type: String }
}));