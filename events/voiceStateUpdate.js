const { MessageEmbed } = require('discord.js');
const helper = require("../helper_functions.js");

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

        // WHEN THE LAST MEMBER LEAVES A MONITORED CHANNEL
        for (let i = 0; i < activeMonitorList.length; i++) {
            if (oldState.channelId === activeMonitorList[i].channelId && oldState.channel.members.size === 0 && activeMonitorList[i].access.find(x => x.id === oldState.member.id) !== undefined) {
                // Update busy state when disconnecting from a monitored channel
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

        // Might be able to connect the previous if statement with the next [CHANGE_NEEDED]

        // If the member is not in the access list, then exit
        if (activeMonitorList[index].access.find(x => x.id === newState.member.id) === undefined) return;

        // Inform the rest of the members in the access list to join
        global.channelBusyState[index] = true;
        for (let member of activeMonitorList[index].access) {
            if (newState.member.id !== member.id) {
                client.users.fetch(member.id)
                    .then(user => {
                        if (member.multiple) {
                            user.send(":arrow_down:");
                            user.send(":arrow_down:");
                        }
                        user.send({ embeds: [this.createEmbedMessage(`<@${newState.member.id}> joined <#${newState.channel.id}>`, newState.member, newState.guild, client)] })
                            .then(console.log(`Activity detected on [${activeMonitorList[index].channelName}]. Notifying [${user.username}]...`));
                        if (member.multiple) {
                            user.send(":arrow_up:");
                            user.send(":arrow_up:");
                        }
                    }).catch(error => console.error(error));
            }
        }
    },
    createEmbedMessage(message, user, guild, client) {
        const notification = new MessageEmbed()
            .setColor(client.theme.Notification)
            .setTitle('[<a:joinvc:852902342415482968>] Someone is waiting for you! [<a:joinvc:852902342415482968>]')
            .setAuthor({ name: `${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) })
            .setDescription(message)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))

        return notification;
    }
};