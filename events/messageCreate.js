const db = require("../Database/Database.js");
const helper = require("../Components/helper_functions.js");
const guildSchema = require("../Database/Schemas/Guild.js");

module.exports = {
    execute: async (message, client) => {
        try {
            // Ignore all bots
            if (message.author.bot) return;

            // Ignore if dm or group chat
            if (!message.guild) return;

            // Get guild prefix
            var guildCache;
            if (!message.guild.prefix) { // If guild cache doesn't contain their prefix then load it
                guildCache = await guildSchema.findOne({ _id: message.guild.id }).select("prefix").lean();
                message.guild.prefix = guildCache.prefix.toLowerCase();
            }

            // Ignore messages not starting with the guild prefix
            if (!message.content.toLowerCase().startsWith(message.guild.prefix)) return;

            // Our standard argument/command name definition.
            const args = message.content.slice(message.guild.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            // Grab the command data from the client.commands Enmap
            const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));

            // If that command doesn't exist, silently exit and do nothing
            if (!cmd) return;

            // Is the author the developer
            const isDeveloper = message.author.id === process.env.OWNER_ID;

            // If the command is inactive then exit
            if (!cmd.active) return message.channel.send(`This command is currently inactive.`);

            // If the command is only available to the developer(s) and the author is not one of them then exit
            if (cmd.developerOnly && !isDeveloper) return message.channel.send(`This command is for developers only.`);

            // If the author doesn't have access to that command then exit
            if (!isDeveloper) {
                if (cmd.permissionBypassers.length === 0 || (cmd.permissionBypassers.length !== 0 && !cmd.permissionBypassers.includes(message.author.id))) {
                    const member = await message.guild.members.fetch(message.author.id);
                    if (!member.permissions.has(cmd.permissions)) return message.channel.send(helper.noPermission);
                }
            }

            // Run the command
            if (!isDeveloper)
                await db.log(cmd.name, message);
            await cmd.run(client, message, args);
        }
        catch (e) {
            console.error(e);
        }
    },
};