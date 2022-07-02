const { MessageEmbed } = require('discord.js');
const helper = require('../Components/helper_functions.js');
const monitoringSchema = require("../Database/Schemas/Monitoring.js");

module.exports = {
    active: true,
    name: 'info',
    description: 'Displays information about the bot',
    aliases: ["bot"],
    developerOnly: false,
    permissionBypassers: [],
    permissions: ["ADMINISTRATOR"],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Process
            let monitoredChannels = await monitoringSchema.countDocuments();
            let botOwner = await client.users.fetch(process.env.OWNER_ID);
            let bot = await client.user.fetch();
            let usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
            let totalRam = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

            const msg = new MessageEmbed()
                .setColor(client.theme.Neutral)
                .setTitle("Information about me")
                .addFields([
                    { name: `Bot Owner`, value: `${botOwner.tag}`, inline: false },
                    { name: `Monitored Channels`, value: `${monitoredChannels}`, inline: false },
                    { name: `API Ping`, value: `${client.ws.ping}ms`, inline: false },
                    { name: `Ram`, value: `${usedRam}MB / ${totalRam}MB`, inline: false },
                ])
                .setThumbnail(bot.displayAvatarURL({ dynamic: true }))
            message.channel.send({ embeds: [msg] });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}