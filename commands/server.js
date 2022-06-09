const { MessageEmbed } = require('discord.js');
const helper = require('../Components/helper_functions.js');

module.exports = {
    name: 'server',
    description: 'Displays details about the current server.',
    aliases: [],
    access: [],
    run: async (client, message, args) => {
        try {
            // Access
            if (helper.hasAccess(module.exports.access, message.author.id)) return message.channel.send(helper.noPermission);

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
                    let presence = guildMember.presence !== null;

                    // Owners [Skip]
                    if (guildMember.roles.cache.some(role => role.name === "Owners")) continue;

                    // Admins
                    if (guildMember.roles.cache.some(role => role.name === "Admins")) {
                        if (presence) onlineAdmins++;
                        totalAdmins++;
                        continue;
                    }

                    // Mods
                    if (guildMember.roles.cache.some(role => role.name === "Moderators")) {
                        if (presence) onlineMods++;
                        totalMods++;
                        continue;
                    }

                    // Members
                    if (presence) onlineMembers++;
                    totalMembers++;
                }
            }

            const response = new MessageEmbed()
                .setColor(client.theme.Neutral)
                .setTitle(`Server Statistics [${guild.name}]`)
                .setThumbnail(guild.iconURL())
                .addFields([
                    { name: `Created At`, value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
                    { name: `Boost Tier`, value: `${guild.premiumTier}`, inline: true },
                    { name: `Boosters`, value: `${guild.premiumSubscriptionCount}`, inline: true },
                    { name: `Owner`, value: `${guildOwner.user.username}#${guildOwner.user.discriminator}`, inline: true },
                    { name: `Bots`, value: `${bots}`, inline: true },
                    { name: `Online Admins`, value: `${onlineAdmins}/${totalAdmins}`, inline: true },
                    { name: `Online Mods`, value: `${onlineMods}/${totalMods}`, inline: true },
                    { name: `Online Members`, value: `${onlineMembers}/${totalMembers}`, inline: true },
                    { name: `All Members`, value: `${guild.memberCount}`, inline: true },
                ])
                .setTimestamp();
            message.channel.send({ embeds: [response] });
        }
        catch (e) {
            console.error(`The command [**${module.exports.name}**] has failed with an error of...\n`, e);
        }
    }
}