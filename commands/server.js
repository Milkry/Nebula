const { MessageEmbed } = require('discord.js');
const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'server',
    description: 'Displays details about the current server.',
    aliases: [],
    developerOnly: false,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Process
            const guild = message.guild;
            if (!guild.available) return console.error("Guild is not available at this time...");
            const guildOwner = await guild.fetchOwner();
            const guildMembersCollection = await guild.members.fetch({ withPresences: true });
            const guildMembers = guildMembersCollection.map(m => m);

            let bots = 0;
            let onlineAdmins = 0, totalAdmins = 0;
            let onlineMods = 0, totalMods = 0;
            let onlineMembers = 0, totalMembers = 0;
            for (const guildMember of guildMembers) {
                if (guildMember.user.bot) bots++;
                else {
                    const isOnline = !(guildMember.presence?.status === undefined || guildMember.presence?.status === "offline");

                    // Owners [Skip]
                    if (guildMember.roles.cache.some(role => role.name === "Owners")) continue;

                    // Admins
                    if (guildMember.roles.cache.some(role => role.name === "Admins")) {
                        if (isOnline) onlineAdmins++;
                        totalAdmins++;
                        continue;
                    }

                    // Mods
                    if (guildMember.roles.cache.some(role => role.name === "Moderators")) {
                        if (isOnline) onlineMods++;
                        totalMods++;
                        continue;
                    }

                    // Members
                    if (isOnline) onlineMembers++;
                    totalMembers++;
                }
            }

            let boosterTier;
            if (guild.premiumTier === "NONE") boosterTier = "None";
            else if (guild.premiumTier === "TIER_1") boosterTier = "Tier 1";
            else if (guild.premiumTier === "TIER_2") boosterTier = "Tier 2";
            else if (guild.premiumTier === "TIER_3") boosterTier = "Tier 3";
            else boosterTier = "Unknown";

            const response = new MessageEmbed()
                .setColor(client.theme.Neutral)
                .setTitle(`Server Statistics [${guild.name}]`)
                .setThumbnail(guild.iconURL())
                .addFields([
                    { name: `Created At`, value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: `Boost Tier`, value: `${boosterTier}`, inline: true },
                    { name: `Boosters`, value: `${guild.premiumSubscriptionCount}`, inline: true },
                    { name: `Owner`, value: `${guildOwner.user.username}#${guildOwner.user.discriminator}`, inline: true },
                    { name: `Bots`, value: `${bots}`, inline: true },
                    { name: `Online Admins`, value: `${onlineAdmins}/${totalAdmins}`, inline: true },
                    { name: `Online Mods`, value: `${onlineMods}/${totalMods}`, inline: true },
                    { name: `Online Members`, value: `${onlineMembers}/${totalMembers}`, inline: true },
                    { name: `Everyone`, value: `${guild.memberCount}`, inline: true },
                ])
                .setTimestamp();
            message.channel.send({ embeds: [response] });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}