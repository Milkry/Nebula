const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState, client) {
        // People to monitor for
        const monitorList = [
            {
                channelName: 'Penthouse',
                channelId: '797450771628163103',
                access: [client.config.myId, '190881082894188544'],
            },
            {
                channelName: 'Boardroom',
                channelId: '553253000987279360',
                access: ['307947376725721089', '544194307414949898'],
            }
        ];

        /*for (let i = 0; i < monitorList.length; i++) {
            if (oldState.channelId === monitorList[i].channelId && monitorList[i].access.includes(newState.member.id)
                && newState.channelId === monitorList[i].channelId && monitorList[i].access.includes(newState.member.id)) {
                
            }
        }*/

        // Update busy state when disconnecting from a monitored channel
        for (let i = 0; i < monitorList.length; i++) {
            if (oldState.channelId === monitorList[i].channelId && oldState.channel.members.size === 0 && monitorList[i].access.includes(oldState.member.id)) {
                global.channelBusyState[i] = false;
                return;
            }
        }

        // If the channel is not in the monitor list, then exit
        let index = -1;
        for (let i = 0; i < monitorList.length; i++) {
            if (newState.channelId === monitorList[i].channelId) {
                index = i; // save the channel the event was triggered from
                break;
            }
        } if (index === -1) return;

        // If the channel has someone in it with access, then exit
        if (global.channelBusyState[index]) return;

        // If the member is not in the access list, then exit
        if (!monitorList[index].access.includes(newState.member.id)) return;

        // Inform the rest of the members in the access list to join
        global.channelBusyState[index] = true;
        for (let id of monitorList[index].access) {
            if (newState.member.id !== id) {
                client.users.fetch(id)
                    .then(user => {
                        user.send({ embeds: [this.createEmbedMessage(`**<@${newState.member.id}>** joined **(<#${newState.channel.id}>)**. Hop on.`, newState.member, newState.guild)] })
                            .then(console.log('Successfully sent a notification!'));
                    }).catch(error => console.error(error));
            }
        }
    },
    createEmbedMessage(message, user, guild) {
        const notification = new MessageEmbed()
            .setColor('#fcba03')
            .setTitle('Someone is waiting for you!')
            .setAuthor({ name: `From ${guild.name}`, iconURL: guild.iconURL({ dynamic: true })})
            .setDescription(message)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()

        return notification;
    }
};