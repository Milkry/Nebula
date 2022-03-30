const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'monitor',
    description: 'Disables notifications for a specific voice channel or for all voice channels.',
    aliases: ['mon'],
    run: async (client, message, args) => {
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;

        switch (args[0]) {

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
                        mlist += "[:white_check_mark:] " + voiceChannel.channelName + "\n";
                    }
                    else {
                        mlist += "[:x:] " + voiceChannel.channelName + "\n";
                    }
                });
                const msg = new MessageEmbed()
                    .setTitle('Monitor Status')
                    .setDescription(mlist)
                    .setTimestamp()
                message.channel.send({ embeds: [msg] });
                break;

            case "global":
            case "g":
                // Validate
                if (!args[1]) {
                    const msg = new MessageEmbed()
                        .setDescription(`A second parameter was not given. It must be either **On** or **Off**.`);
                    message.channel.send({ embeds: [msg] });
                    return;
                }

                // Process the command
                if (args[1].toLowerCase() === "on") {
                    client.monitor = true;
                    const msg = new MessageEmbed()
                        .setDescription(`Global channel monitoring is now **ENABLED**.`);
                    message.channel.send({ embeds: [msg] });
                }
                else if (args[1].toLowerCase() === "off") {
                    client.monitor = false;
                    const msg = new MessageEmbed()
                        .setDescription(`Global channel monitoring is now **DISABLED**.`);
                    message.channel.send({ embeds: [msg] });
                }
                else {
                    const msg = new MessageEmbed()
                        .setDescription(`Invalid second argument...`);
                    message.channel.send({ embeds: [msg] });
                }
                break;

            default:
                const channel = args[0];
                const status = args[1];

                // Validate
                if (!status) {
                    const msg = new MessageEmbed()
                        .setDescription(`A second parameter must be given.`);
                    message.channel.send({ embeds: [msg] });
                    return;
                }
                if (status.toLowerCase() !== "on" && status.toLowerCase() !== "off") {
                    const msg = new MessageEmbed()
                        .setDescription(`Second parameter must be either **On** or **Off**.`);
                    message.channel.send({ embeds: [msg] });
                    return;
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
                    const msg = new MessageEmbed()
                        .setDescription(`The channel requested was not found.`);
                    message.channel.send({ embeds: [msg] });
                }
                break;
        }
    }
}