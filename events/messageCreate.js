const db = require("../Database/Database.js");
const helper = require("../Components/helper_functions.js");

module.exports = {
    execute: async (message, client) => {
        try {
            // Ignore all bots
            if (message.author.bot) return;

            // Ignore messages not starting with the prefix (in config.json)
            if (message.content.indexOf(client.config.prefix) !== 0) return;

            // Our standard argument/command name definition.
            const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // Grab the command data from the client.commands Enmap
            const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));

            // If that command doesn't exist, silently exit and do nothing
            if (!cmd) return;

            // If the command is inactive then exit
            if (!cmd.active) return message.channel.send(`This command is currently inactive.`);

            // If the author doesn't have access to that command then exit
            if (cmd.access.length !== 0 && !cmd.access.includes(message.author.id)) return message.channel.send(helper.noPermission);

            // Run the command
            if (message.author.id !== process.env.OWNER_ID)
                await db.log(cmd.name, message);
            await cmd.run(client, message, args);
        }
        catch (e) {
            console.error(e);
        }
    },
};