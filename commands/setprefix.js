const helper = require('../Components/helper_functions.js');
const guildSchema = require("../Database/Schemas/Guild.js");

module.exports = {
    active: true,
    name: 'setprefix',
    description: 'Sets the server new prefix',
    aliases: [],
    developerOnly: true,
    permissionBypassers: [],
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            const newPrefix = args[0];

            // Validate
            if (!newPrefix) {
                let response = await helper.createEmbedResponse(`:x: You must provide a new prefix`, client.theme.Fail);
                return message.channel.send({ embeds: [response] });
            }

            // Process
            await guildSchema.updateOne({ _id: message.guild.id }, { prefix: newPrefix })
                .then(async () => {
                    let response = await helper.createEmbedResponse(`:white_check_mark: Prefix has been set \`${newPrefix}\``, client.theme.Success);
                    return message.channel.send({ embeds: [response] });
                })
                .catch(async (e) => {
                    console.error(e);
                    let response = await helper.createEmbedResponse(`:x: Could not set new prefix \`${newPrefix}\``, client.theme.Fail);
                    return message.channel.send({ embeds: [response] });
                });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}