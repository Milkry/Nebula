const mongoose = require('mongoose');
const guildSchema = require('../Database/Schemas/Guild.js');

module.exports = {
    execute: async (guild, client) => {
        try {
            const guildDB = new guildSchema({
                _id: guild.id,
                name: guild.name,
            })
            await guildDB.save()
                .then(() => console.log("Added new Guild to database!"))
                .catch(err => console.log("Failed to add new guild to database... \n", err));
        }
        catch (e) {
            console.error("An unknown event error has occurred...\n", e);
        }
    },
};