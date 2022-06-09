const logSchema = require("./Schemas/Log.js");

module.exports = {
    log: async (command, message) => {
        const logCmd = new logSchema({
            command: command,
            executor: {
                id: message.author.id,
                name: message.author.username
            },
            guild: {
                id: message.guildId,
                name: message.guild.name,
                channel: message.channelId
            }
        });
        await logCmd.save().catch(err => console.error(`Failed to log command...\n`, err));
    }
}