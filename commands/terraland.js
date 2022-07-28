const helper = require('../Components/helper_functions.js');
const server = require('minecraft-server-util');
const { EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    active: true,
    name: 'terraland',
    description: 'Gets information about terraland',
    aliases: ["tl"],
    developerOnly: false,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Variables
            const serverip = "terraland02.serveminecraft.net";
            const port = 25565;

            // Process
            const serverDetailed = await server.queryFull(serverip, port)
                .catch(e => console.error(e));

            if (!serverDetailed) {
                return helper.createEmbedResponseAndSend(`:x: Server is currently offline`, client.theme.Fail, message.channel);
            }

            const msg = new EmbedBuilder()
                .setColor(client.theme.Neutral)
                .setTitle(`Terraland Server Statistics`)
                .setDescription(serverDetailed.motd.clean)
                .setThumbnail('https://cdn.discordapp.com/attachments/553297713362632764/1001483426878206022/logo1.jpg?width=678&height=676')
                .setFields(
                    { name: `[<:Minecraft_World_Cube:1002229758563713125>] IP`, value: serverip, inline: true },
                    { name: `[<a:steve_spin:1002229699742810122>] Players`, value: `${serverDetailed.players.online}/${serverDetailed.players.max}`, inline: true },
                    { name: `[<:WrittenBook:1002230090727428106>] Version`, value: `v${serverDetailed.version}`, inline: true },
                );
            message.channel.send({ embeds: [msg] });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}