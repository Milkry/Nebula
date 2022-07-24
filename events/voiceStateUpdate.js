const { EmbedBuilder } = require('discord.js');
const helper = require("../Components/helper_functions.js");
const guildSchema = require("../Database/Schemas/Guild.js");
const monitoringSchema = require("../Database/Schemas/Monitoring.js");

module.exports = {
    execute: async (oldState, newState, client) => {
        try {
            // Ignore event updates other than joins and leaves
            if (oldState.channelId === newState.channelId) return;

            // If guild channel monitoring is off, then stop.
            let guildId = newState.guild.id; if (guildId === undefined) guildId = oldState.guild.id;
            const result = await guildSchema.findOne({ _id: guildId });
            if (result === null || !result.monitoring) return;

            // Event Cases
            const JOINS = oldState.channelId === null && newState.channelId !== null;
            const SWITCH_CHANNEL = oldState.channelId !== null && newState.channelId !== null;
            const LEAVE = oldState.channelId !== null && newState.channelId === null;

            if (JOINS) {
                //console.log("> Offline -> Channel");
                await module.exports.handleJOIN(newState, client);
            } else if (SWITCH_CHANNEL) {
                //console.log("> Channel -> Channel");
                await module.exports.handleLEAVE(oldState);
                await module.exports.handleJOIN(newState, client);
            } else if (LEAVE) {
                //console.log("> Channel -> Offline");
                await module.exports.handleLEAVE(oldState);
            } else {
                console.error("Unknown Connection Event.");
            }
        }
        catch (e) {
            console.error("An unknown event error has occurred...\n", e);
        }
    },
    handleJOIN: async (newState, client) => {
        // If the channel is not in the monitor list, then stop
        let monitoredChannel = await monitoringSchema.findOne({ _id: newState.channelId });
        if (monitoredChannel === null) return;

        // If the channel is not active, then stop
        if (!monitoredChannel.active) return;

        // If the channel is busy, then stop
        if (monitoredChannel.busy) return;

        // If the member who just joined a monitored channel is not in the access list of that channel, then stop (ignore them)
        if (monitoredChannel.access.find(x => x._id === newState.member.id) === undefined) return;

        // Update monitored channel busy state
        await monitoringSchema.updateOne({ _id: monitoredChannel._id }, { busy: true })
            .then(() => console.log(`Updated Channel Busy State to [TRUE] for [${monitoredChannel.channelName}]`));

        // Inform the rest of the members in the access list to join
        for (let member of monitoredChannel.access) {
            if (member._id !== newState.member.id) {
                await client.users.fetch(member._id)
                    .then(user => {
                        if (member.settings.multiple) {
                            user.send(":arrow_down:");
                            user.send(":arrow_down:");
                        }
                        user.send({ embeds: [module.exports.createEmbedMessage(newState, client.theme.Notification)] })
                            .then(() => console.log(`Activity detected on [${monitoredChannel.channelName}]. Notifying [${user.username}]...`));
                        if (member.settings.multiple) {
                            user.send(":arrow_up:");
                            user.send(":arrow_up:");
                        }
                    }).catch(err => console.error("Something went wrong with channel monitoring... \n", err));
            }
        }
    },
    handleLEAVE: async (oldState) => {
        // If the channel is not being monitored, then stop
        const leaverChannel = await monitoringSchema.findOne({ _id: oldState.channelId });
        if (leaverChannel === null) return;

        // If the channel is not active, then stop
        if (!leaverChannel.active) return;

        if (leaverChannel.access.find(x => x._id === oldState.member.id) !== undefined && await module.exports.isVoiceChannelEmpty(oldState.channel.members, leaverChannel.access)) {
            return await monitoringSchema.updateOne({ _id: leaverChannel._id }, { busy: false })
                .then(() => console.log(`Updated Channel Busy State to [FALSE] for [${leaverChannel.channelName}]`));;
        }
    },
    createEmbedMessage: (state, theme) => {
        const notification = new EmbedBuilder()
            .setColor(theme)
            .setTitle(`[<a:joinvc:852902342415482968>] Someone Joined! [<a:joinvc:852902342415482968>]`)
            .setAuthor({ name: `${state.guild.name}`, iconURL: state.guild.iconURL({ dynamic: true }) })
            .setThumbnail(state.member.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: `Who:`, value: `<@${state.member.id}>`, inline: true },
                { name: `Where:`, value: `<#${state.channelId}>`, inline: true },
                { name: `When:`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            );

        return notification;
    },
    // If the voice channel specified has no members with access in it then it will return True, else False
    isVoiceChannelEmpty: async (members, access) => {
        const currentMembers = members.map(x => x.id);
        for (let member of access) {
            if (currentMembers.includes(member._id)) {
                return false;
            }
        }
        return true;
    }
};