const { MessageEmbed } = require("discord.js");
const helper = require("../Components/helper_functions.js");
const guildSchema = require("../Database/Schemas/Guild.js");
const monitoringSchema = require("../Database/Schemas/Monitoring.js");
const userSchema = require("../Database/Schemas/User.js");

module.exports = {
    active: true,
    name: 'monitor',
    description: 'Disables notifications for a specific voice channel or for all voice channels.',
    aliases: ['mon'],
    developerOnly: true,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            var context = args[0];
            var status;
            var channelId;
            var user;

            // Process
            switch (context) {
                //#region add
                case "add":
                    // Command Parameters
                    channelId = args[1];
                    user = message.mentions.users.first();

                    // Validate
                    if (!channelId || isNaN(channelId)) {
                        let response = await helper.createEmbedResponse(`:x: The channel id given is not valid`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    try {
                        var channel = await message.guild.channels.fetch(channelId)
                    }
                    catch (e) {
                        let response = await helper.createEmbedResponse(`:x: This channel does not exist`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    if (channel.type !== "GUILD_VOICE") {
                        let response = await helper.createEmbedResponse(`:x: This channel is not a voice channel`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }

                    // Process
                    // monitor add {channel_id}
                    if (!user) {
                        // Check if in database
                        if (await monitoringSchema.findOne({ _id: channel.id }).select("_id").lean() !== null) {
                            let response = await helper.createEmbedResponse(`:x: <#${channel.id}> is already a monitored channel`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }

                        let newMonitoredChannel = await monitoringSchema({
                            _id: channel.id,
                            channelName: channel.name,
                            access: [],
                            guildId: message.guildId
                        });
                        newMonitoredChannel.save()
                            .then(async () => {
                                let response = await helper.createEmbedResponse(`:white_check_mark: The channel <#${channel.id}> was successfully added`, client.theme.Success);
                                return message.channel.send({ embeds: [response] });
                            })
                            .catch(async (e) => {
                                console.error(e);
                                let response = await helper.createEmbedResponse(helper.dbError, client.theme.Fail);
                                return message.channel.send({ embeds: [response] });
                            });
                    }
                    // monitor add {channel_id} {@user}
                    else {
                        // Validate
                        if (user.bot) {
                            let response = await helper.createEmbedResponse(`:x: The user cannot be a bot`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }

                        // Process
                        let isMonitored = await monitoringSchema.findOne({ _id: channel.id }).select("_id").lean() !== null;

                        if (isMonitored) { // If in database
                            // Add only user
                            let member = await userSchema.findOne({ _id: user.id });
                            await monitoringSchema.updateOne({ _id: channel.id }, { $push: { access: member } })
                                .then(async () => {
                                    let response = await helper.createEmbedResponse(`:white_check_mark: User was added to <#${channel.id}>`, client.theme.Success);
                                    return message.channel.send({ embeds: [response] });
                                })
                                .catch(async (e) => {
                                    console.error(e);
                                    let response = await helper.createEmbedResponse(helper.dbError, client.theme.Fail);
                                    return message.channel.send({ embeds: [response] });
                                });
                        }
                        else {
                            // Add channel AND user
                            let response = await helper.createEmbedResponse(`:warning: <#${channel.id}> is not a monitored channel. Adding it...`, client.theme.Notification);
                            message.channel.send({ embeds: [response] });

                            let member = await userSchema.findOne({ _id: user.id });
                            let newMonitoredChannel = await monitoringSchema({
                                _id: channel.id,
                                channelName: channel.name,
                                access: member,
                                guildId: message.guildId
                            });
                            await newMonitoredChannel.save()
                                .then(async () => {
                                    let response = await helper.createEmbedResponse(`:white_check_mark: The channel <#${channel.id}> and user were successfully added`, client.theme.Success);
                                    return message.channel.send({ embeds: [response] });
                                })
                                .catch(async (e) => {
                                    console.error(e);
                                    let response = await helper.createEmbedResponse(helper.dbError, client.theme.Fail);
                                    return message.channel.send({ embeds: [response] });
                                });
                        }
                    }
                    break;
                //#endregion

                //#region remove
                // monitor remove {channel_id} {@user}
                // monitor remove {channel_id}
                case "remove":
                    // Command Parameters
                    channelId = args[1];
                    user = message.mentions.users.first();

                    // Validate
                    if (!channelId || isNaN(channelId)) {
                        let response = await helper.createEmbedResponse(`:x: The channel id given must be valid`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    try {
                        var channel = await message.guild.channels.fetch(channelId)
                    }
                    catch (e) {
                        let response = await helper.createEmbedResponse(`:x: The channel given does not exist`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    if (channel.type !== "GUILD_VOICE") {
                        let response = await helper.createEmbedResponse(`:x: The channel given is not a voice channel`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    // Check if in database
                    if (await monitoringSchema.findOne({ _id: channel.id }).select("_id").lean() === null) {
                        let response = await helper.createEmbedResponse(`:x: <#${channel.id}> is not a monitored channel`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }

                    // Process
                    // monitor remove {channel_id}
                    if (!user) {
                        // Delete from database
                        await monitoringSchema.deleteOne({ _id: channel.id })
                            .then(async () => {
                                let response = await helper.createEmbedResponse(`:white_check_mark: <#${channel.id}> is no longer being monitored`, client.theme.Success);
                                return message.channel.send({ embeds: [response] });
                            })
                            .catch(async (e) => {
                                console.error(e);
                                let response = await helper.createEmbedResponse(helper.dbError, client.theme.Fail);
                                return message.channel.send({ embeds: [response] });
                            });
                    }
                    // monitor remove {channel_id} {@user}
                    else {
                        // Validate
                        if (user.bot) {
                            let response = await helper.createEmbedResponse(`:x: The user cannot be a bot`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }

                        // Process
                        let member = await userSchema.findOne({ _id: user.id });

                        // Before updating db check if the member is there (access)
                        if (await monitoringSchema.findOne({ _id: channel.id, access: member }).select("_id").lean() === null) {
                            let response = await helper.createEmbedResponse(`:x: User doesn't have access to <#${channel.id}>`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }

                        await monitoringSchema.updateOne({ _id: channel.id }, { $pull: { access: member } })
                            .then(async () => {
                                let response = await helper.createEmbedResponse(`:white_check_mark: Access to <#${channel.id}> has been revoked`, client.theme.Success);
                                return message.channel.send({ embeds: [response] });
                            })
                            .catch(async (e) => {
                                console.error(e);
                                let response = await helper.createEmbedResponse(helper.dbError, client.theme.Fail);
                                return message.channel.send({ embeds: [response] });
                            });
                    }
                    break;
                //#endregion

                //#region status
                case "status":
                case "s":
                    // Command Parameters
                    channelId = args[1];

                    // Process
                    if (!channelId) {
                        let monitorlist = "";
                        const guild = await guildSchema.findOne({ _id: message.guildId });

                        if (guild.monitoring)
                            monitorlist += ":white_check_mark: ⮞ Global Server Monitoring";
                        else
                            monitorlist += ":x: ⮞ Global Server Monitoring";
                        monitorlist += "\n\n\n";

                        const monitoredChannels = await monitoringSchema.find({ guildId: message.guildId });
                        monitoredChannels.forEach(voiceChannel => {
                            if (voiceChannel.active)
                                monitorlist += `:white_check_mark: ⮞〖${voiceChannel._id}〗[<#${voiceChannel._id}>] (${voiceChannel.access.length} members)`;
                            else
                                monitorlist += `:x: ⮞〖${voiceChannel._id}〗[<#${voiceChannel._id}>] (${voiceChannel.access.length} members)`;
                            monitorlist += "\n\n";
                        });

                        const msg = new MessageEmbed()
                            .setTitle('Monitoring Status')
                            .setDescription(monitorlist)
                            .setColor(client.theme.Neutral)
                        message.channel.send({ embeds: [msg] });
                    }
                    else {
                        // Validate
                        if (isNaN(channelId)) {
                            let response = await helper.createEmbedResponse(`:x: The channel id given must be valid`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }
                        try {
                            var channel = await message.guild.channels.fetch(channelId)
                        }
                        catch (e) {
                            let response = await helper.createEmbedResponse(`:x: The channel given does not exist`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }
                        if (channel.type !== "GUILD_VOICE") {
                            let response = await helper.createEmbedResponse(`:x: The channel given is not a voice channel`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }
                        // Check if in database
                        if (await monitoringSchema.findOne({ _id: channel.id }).select("_id").lean() === null) {
                            let response = await helper.createEmbedResponse(`:x: <#${channel.id}> is not a monitored channel`, client.theme.Fail);
                            return message.channel.send({ embeds: [response] });
                        }

                        // Process
                        let monitoredChannel = await monitoringSchema.findOne({ _id: channel.id });
                        let members = "";
                        monitoredChannel.access.forEach(member => {
                            members += `⮞ @${member.user.username}#${member.user.discriminator}`;
                            members += "\n";
                        })
                        var active, busy;
                        if (monitoredChannel.active) active = ":white_check_mark:";
                        else active = ":x:";
                        if (monitoredChannel.busy) busy = ":white_check_mark:";
                        else busy = ":x:";
                        const msg = new MessageEmbed()
                            .setTitle(`〖${monitoredChannel._id}〗${monitoredChannel.channelName}`)
                            .setColor(client.theme.Neutral)
                            .setDescription(members)
                            .addFields(
                                { name: `Total members:`, value: `${monitoredChannel.access.length}`, inline: true },
                                { name: `Active:`, value: `${active}`, inline: true },
                                { name: `Busy:`, value: `${busy}`, inline: true },
                            )
                            .setTimestamp();
                        message.channel.send({ embeds: [msg] });
                    }
                    break;
                //#endregion

                //#region global
                case "global":
                case "g":
                    // Command Parameters
                    status = args[1];

                    // Validate & Process
                    if (!status) {
                        return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: A second parameter was not given. It must be either **On** or **Off**`, client.theme.Fail)] });
                    }
                    if (status.toLowerCase() === "on") {
                        await guildSchema.updateOne({ _id: message.guildId }, { monitoring: true })
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **ENABLED**`, client.theme.Success)] });
                    }
                    else if (status.toLowerCase() === "off") {
                        await guildSchema.updateOne({ _id: message.guildId }, { monitoring: false })
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: Global channel monitoring is now **DISABLED**`, client.theme.Success)] });
                    }
                    else {
                        message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Invalid second argument...`, client.theme.Fail)] });
                    }
                    break;
                //#endregion

                //#region custom channel
                // monitor -c channel status
                case "-c":
                    // Command Parameters
                    channel = args[1]; // {channel_id} || {channel_name}
                    status = args[2]; // on || off

                    // Validate
                    if (!channel) {
                        let response = await helper.createEmbedResponse(`:x: Channel id/name was not given`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }
                    if (!status) {
                        let response = await helper.createEmbedResponse(`:x: Status for channel was not given`, client.theme.Fail)
                        return message.channel.send({ embeds: [response] });
                    }
                    if (status.toLowerCase() !== "on" && status.toLowerCase() !== "off") {
                        let response = await helper.createEmbedResponse(`:x: Status must be either **On** or **Off**`, client.theme.Fail);
                        return message.channel.send({ embeds: [response] });
                    }

                    // Process the command
                    let found = false;
                    const channels = await monitoringSchema.find({ guildId: message.guildId });
                    for (let voiceChannel of channels) {
                        if (voiceChannel._id === channel || voiceChannel.channelName.toLowerCase() === channel.toLowerCase()) {
                            if (status.toLowerCase() === "on") {
                                await monitoringSchema.updateOne({ _id: voiceChannel._id }, { active: true });
                                let response = await helper.createEmbedResponse(`:white_check_mark: Channel monitoring for <#${voiceChannel._id}> has been **ENABLED**`, client.theme.Success)
                                message.channel.send({ embeds: [response] });
                            }
                            else {
                                await monitoringSchema.updateOne({ _id: voiceChannel._id }, { active: false });
                                let response = await helper.createEmbedResponse(`:white_check_mark: Channel monitoring for <#${voiceChannel._id}> has been **DISABLED**`, client.theme.Success)
                                message.channel.send({ embeds: [response] });
                            }
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        let response = await helper.createEmbedResponse(`:x: The channel **${context}** was not found`, client.theme.Fail);
                        message.channel.send({ embeds: [response] });
                    }
                    break;
                //#endregion

                default:
                    let response = await helper.createEmbedResponse(`:x: Unknown command syntax. Please refer to **${message.guild.prefix}help**`, client.theme.Fail);
                    message.channel.send({ embeds: [response] });
                    break;
            }
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}