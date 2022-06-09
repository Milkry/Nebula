const db = require("../Database/Database.js");

module.exports = {
    execute: async (message, client) => {
        // Ignore all bots
        if (message.author.bot) return;

        // Ignore messages not starting with the prefix (in config.json)
        if (message.content.indexOf(client.config.prefix) !== 0) return;

        // Our standard argument/command name definition.
        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        // Grab the command data from the client.commands Enmap
        const cmd = client.commands.get(command) || client.commands.find(a => a.aliases && a.aliases.includes(command));

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        // Run the command
        try {
            if (message.author.id !== process.env.OWNER_ID)
                await db.log(cmd.name, message);
            await cmd.run(client, message, args);
        } catch (error) {
            console.error(error);
        }
    },
};