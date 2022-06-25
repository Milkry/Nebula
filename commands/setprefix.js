const helper = require('../Components/helper_functions.js');
const guildSchema = require("../Database/Schemas/Guild.js");

module.exports = {
    active: true,
    name: 'setprefix',
    description: 'Sets the server new prefix',
    aliases: [],
    developerOnly: false,
    permissionBypassers: [],
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const newPrefix = args[0];

            // Validate
            if (!newPrefix) {
                return helper.createEmbedResponseAndSend(`:x: You must provide a new prefix`, client.theme.Fail, message.channel);
            }

            // Process
            await guildSchema.updateOne({ _id: message.guild.id }, { prefix: newPrefix })
                .then(async () => {
                    message.guild.prefix = newPrefix;
                    return helper.createEmbedResponseAndSend(`:white_check_mark: Prefix has been set \`${newPrefix}\``, client.theme.Success, message.channel);
                })
                .catch(async (e) => {
                    console.error(e);
                    return helper.createEmbedResponseAndSend(`:x: Could not set new prefix \`${newPrefix}\``, client.theme.Fail, message.channel);
                });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}