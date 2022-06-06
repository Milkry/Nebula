const { MessageEmbed } = require("discord.js");
const helper = require("../helper_functions.js");
const guildSchema = require("../Database/Schemas/Guild.js");
const monitoringSchema = require("../Database/Schemas/Monitoring.js");

module.exports = {
    name: 'monitor',
    description: 'Disables notifications for a specific voice channel or for all voice channels.',
    aliases: ['mon'],
    run: async (client, message, args) => {
        try {
            // Access
            const access = [process.env.OWNER_ID];
            if (!access.includes(message.author.id)) return;

            // Command Parameters
            const channel = args[0];
            const status = args[1];

            // Process
            switch (channel) {
                case "status":
                case "s":
                    let mlist = "";
                    const guild = await guildSchema.findOne({ _id: message.guildId });

                    if (guild.monitoring) {
                        mlist += "[:white_check_mark:] Global Monitoring\n\n";
                    }
                    else {
                        mlist += "[:x:] Global Monitoring\n\n";
                    }

                    const monitoredChannels = await monitoringSchema.find({ guildId: message.guildId });
                    monitoredChannels.forEach(voiceChannel => {
                        if (voiceChannel.active) {
                            mlist += "[:white_check_mark:] " + voiceChannel.channelName + " (" + voiceChannel.access.length + " members)\n";
                        }
                        else {
                            mlist += "[:x:] " + voiceChannel.channelName + " (" + voiceChannel.access.length + " members)\n";
                        }
                    });

                    const msg = new MessageEmbed()
                        .setTitle('Monitoring Status')
                        .setDescription(mlist)
                        .setColor(client.theme.Neutral)
                    message.channel.send({ embeds: [msg] });
                    break;

                case "global":
                case "g":
                    if (!access.includes(message.author.id)) return;

                    // Validate & Process
                    if (!status) {
                        return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: A second parameter was not given. It must be either **On** or **Off**.`, client.theme.Fail)] });
                    }
                    if (status.toLowerCase() === "on") {
                        await guildSchema.updateOne({ _id: message.guildId }, { monitoring: true })
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **ENABLED**.`, client.theme.Success)] });
                    }
                    else if (status.toLowerCase() === "off") {
                        await guildSchema.updateOne({ _id: message.guildId }, { monitoring: false })
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **DISABLED**.`, client.theme.Success)] });
                    }
                    else {
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Invalid second argument...`, client.theme.Fail)] });
                    }
                    break;

                default:
                    if (!access.includes(message.author.id)) return;

                    // Validate
                    if (!channel) {
                        return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Missing command arguments.`, client.theme.Fail)] });
                    }
                    if (!status) {
                        return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Not enough command arguments. A second parameter must be given.`, client.theme.Fail)] });
                    }
                    if (status.toLowerCase() !== "on" && status.toLowerCase() !== "off") {
                        return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Second parameter must be either **On** or **Off**.`, client.theme.Fail)] });
                    }

                    // Process the command
                    let found = false;
                    const channels = await monitoringSchema.find({ guildId: message.guildId });
                    for (let voiceChannel of channels) {
                        if (voiceChannel._id === channel || voiceChannel.channelName.toLowerCase() === channel.toLowerCase()) {
                            if (status.toLowerCase() === "on") {
                                await monitoringSchema.updateOne({ _id: voiceChannel._id }, { active: true });
                                const msg = new MessageEmbed()
                                    .setDescription(`Channel monitoring for __${voiceChannel.channelName}__ has been **ENABLED**.`);
                                message.channel.send({ embeds: [msg] });
                            }
                            else {
                                await monitoringSchema.updateOne({ _id: voiceChannel._id }, { active: false });
                                const msg = new MessageEmbed()
                                    .setDescription(`Channel monitoring for __${voiceChannel.channelName}__ has been **DISABLED**.`);
                                message.channel.send({ embeds: [msg] });
                            }
                            found = true;
                        }
                    }
                    if (!found) {
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: The channel **${channel}** was not found.`, client.theme.Fail)] });
                    }
                    break;
            }
        }
        catch (e) {
            console.error(`The command [**${module.exports.name}**] has failed with an error of...`, e);
            const msg = new MessageEmbed()
                .setDescription(`Kati epien skata. <@${process.env.OWNER_ID}> ela sastaaa.>`)
                .setColor(client.theme.Neutral)
            message.channel.send({ embeds: [msg] });
        }
    }
}