const { MessageEmbed } = require('discord.js');
const helper = require('../helper_functions.js');

module.exports = {
    name: 'monitor',
    description: 'Disables notifications for a specific voice channel or for all voice channels.',
    aliases: ['mon'],
    run: async (client, message, args) => {
        // Access
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;

        // Command Parameters
        const channel = args[0];
        const status = args[1];

        // Process
        switch (channel) {
            case "status":
            case "s":
                let mlist = "";
                if (client.monitor) { // if the global monitor setting is on
                    mlist += "[:white_check_mark:] Global Monitoring\n\n";
                }
                else { // if it is off
                    mlist += "[:x:] Global Monitoring\n\n";
                }
                client.monitorList.forEach(voiceChannel => {
                    if (voiceChannel.active) {
                        mlist += "[:white_check_mark:] " + voiceChannel.channelName + " (" + voiceChannel.access.length + " members)\n";
                    }
                    else {
                        mlist += "[:x:] " + voiceChannel.channelName + " (" + voiceChannel.access.length + " members)\n";
                    }
                });
                const msg = new MessageEmbed()
                    .setTitle('Monitor Status')
                    .setDescription(mlist)
                    .setColor(client.theme.Neutral)
                message.channel.send({ embeds: [msg] });
                break;

            case "global":
            case "g":
                // Validate & Process
                if (!status) {
                    return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: A second parameter was not given. It must be either **On** or **Off**.`, client.theme.Fail)] });
                }
                if (status.toLowerCase() === "on") {
                    client.monitor = true;
                    message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **ENABLED**.`, client.theme.Success)] });
                }
                else if (status.toLowerCase() === "off") {
                    client.monitor = false;
                    message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **DISABLED**.`, client.theme.Success)] });
                }
                else {
                    message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Invalid second argument...`, client.theme.Fail)] });
                }
                break;

            default:
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
                client.monitorList.forEach(voiceChannel => {
                    if (voiceChannel.channelId === channel || voiceChannel.channelName.toLowerCase() === channel.toLowerCase()) {
                        if (status.toLowerCase() === "on") {
                            voiceChannel.active = true;
                            const msg = new MessageEmbed()
                                .setDescription(`Channel monitoring for __${voiceChannel.channelName}__ has been **ENABLED**.`);
                            message.channel.send({ embeds: [msg] });
                        }
                        else {
                            voiceChannel.active = false;
                            const msg = new MessageEmbed()
                                .setDescription(`Channel monitoring for __${voiceChannel.channelName}__ has been **DISABLED**.`);
                            message.channel.send({ embeds: [msg] });
                        }
                        found = true;
                    }
                })
                if (!found) {
                    message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: The channel requested was not found.`, client.theme.Fail)] });
                }
                break;
        }
    }
}