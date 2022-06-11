const guildSchema = require('../Database/Schemas/Guild.js');

module.exports = {
    execute: async (guild, client) => {
        try {
            await guildSchema.deleteOne({ _id: guild.id })
                .then(() => console.log("A Guild has been removed from the database!"))
                .catch(err => console.error("Failed to remove a guild from the database... \n", err));
        }
        catch (e) {
            console.error("An unknown event error has occurred...\n", e);
        }
    },
};