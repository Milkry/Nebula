const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState, client) {
        // If global voice channel monitoring is off, then just exit.
        if (!client.monitor) return;

        // Get all the active voice channels from the monitor list
        let activeMonitorList = [];
        for (let voiceChannel of client.monitorList) {
            if (voiceChannel.active)
                activeMonitorList.push(voiceChannel);
        }

        /*for (let i = 0; i < activeMonitorList.length; i++) {
            if (oldState.channelId === activeMonitorList[i].channelId && activeMonitorList[i].access.includes(newState.member.id)
                && newState.channelId === activeMonitorList[i].channelId && activeMonitorList[i].access.includes(newState.member.id)) {
            }
        }*/

        // Update busy state when disconnecting from a monitored channel
        for (let i = 0; i < activeMonitorList.length; i++) {
            if (oldState.channelId === activeMonitorList[i].channelId && oldState.channel.members.size === 0 && activeMonitorList[i].access.includes(oldState.member.id)) {
                global.channelBusyState[i] = false;
                return;
            }
        }

        // If the channel is not in the monitor list, then exit
        let index = -1;
        for (let i = 0; i < activeMonitorList.length; i++) {
            if (newState.channelId === activeMonitorList[i].channelId) {
                index = i; // save the channel the event was triggered from
                break;
            }
        } if (index === -1) return;

        // If the channel has someone in it with access, then exit
        if (global.channelBusyState[index]) return;

        // If the member is not in the access list, then exit
        if (!activeMonitorList[index].access.includes(newState.member.id)) return;

        // Inform the rest of the members in the access list to join
        global.channelBusyState[index] = true;
        for (let id of activeMonitorList[index].access) {
            if (newState.member.id !== id) {
                client.users.fetch(id)
                    .then(user => {
                        user.send({ embeds: [this.createEmbedMessage(`**<@${newState.member.id}>** joined **(<#${newState.channel.id}>)**`, newState.member, newState.guild)] })
                            .then(console.log(`Activity detected on [${activeMonitorList[index].channelName}]. Notifying [${user.username}].`));
                    }).catch(error => console.error(error));
            }
        }
    },
    createEmbedMessage(message, user, guild) {
        const notification = new MessageEmbed()
            .setColor('#fcba03')
            .setTitle('[<a:joinvc:852902342415482968>] Someone is waiting for you! [<a:joinvc:852902342415482968>]')
            .setAuthor({ name: `From ${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(message)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return notification;
    }
};