const helper = require("../Components/helper_functions.js");

module.exports = {
    active: true,
    name: 'reload',
    description: 'Reloads a command without needing to restart the bot',
    aliases: ['rel'],
    developerOnly: true,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const commandName = args[0];

            // Validate
            if (!commandName) {
                return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Must provide a command to reload.`, client.theme.Fail)] });
            }
            if (!client.commands.has(commandName)) { // Check if the command exists and is valid
                return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: This command does not exist.`, client.theme.Fail)] });
            }

            // Process
            delete require.cache[require.resolve(`./${commandName}.js`)];
            // We also need to delete and reload the command from the client.commands Enmap
            client.commands.delete(commandName);
            const props = require(`./${commandName}.js`);
            client.commands.set(commandName, props);
            message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: **${commandName}** has been reloaded.`, client.theme.Success)] });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}