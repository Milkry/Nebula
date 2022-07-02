const { MessageEmbed } = require("discord.js");
const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'help',
    description: 'Displays a help menu with available commands',
    aliases: [],
    developerOnly: false,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            var helpDescription = ``;

            helpDescription += `
                Prefix: [ \` ${message.guild.prefix} \` ]
            
                🞛 **nh/nhentai <nh_code> [-p : respond to channel]** : Responds with details about a doujin
                🞛 **nh/nhentai <nh_code> <@user>** : DM's the user details about a doujin
                🞛 **server** : Displays information about the server
                🞛 **info/bot** : Displays information about me :)
            `;

            if (message.author.id === process.env.OWNER_ID) {
                helpDescription += `
                    🞛 **rr/rickroll <channel_id>** : Bot joins the voice channel and starts playing rick roll
                    🞛 **dmrr/dmrickroll <@user>** : DMs the specified user a little surprise :)
                    🞛 **disc/disconnect** : Disconnects the bot from the voice channel
                    🞛 **rel/reload <full_command_name>** : Reloads a specified command
                    🞛 **mon/monitor <(s)tatus>** : Displays a list of monitored voice channels
                    🞛 **mon/monitor <(s)tatus> <channel_id>** : Displays more details about a specific monitored channel
                    🞛 **mon/monitor <(g)lobal> <on/off>** : Enables/Disables global monitoring for the server
                    🞛 **mon/monitor -c <channel_id/channel_name> <on/off>** : Enables/Disables monitoring for a specific channel
                    🞛 **mon/monitor add <channel_id> <@user>** : Adds a user in the access list of a specific monitored channel (Adds channel too if not monitored)
                    🞛 **mon/monitor add <channel_id>** : Adds the channel to the monitor list
                    🞛 **mon/monitor remove <channel_id> <@user>** : Removes a user from the access list of a specific monitored channel
                    🞛 **mon/monitor remove <channel_id>** : Removes the channel from the monitor list
                `;
                helpDescription += `\n**Note**: You can get the channel id by enabling __Developer Mode__ in *Advanced Settings* and right-clicking on a voice channel.`;
            }

            await message.delete();
            const helpMenu = new MessageEmbed()
                .setColor(client.theme.Notification)
                .setAuthor({ name: `Nebula`, iconURL: client.user.avatarURL({ dynamic: true }) })
                .setTitle(`:scroll: **HELP MENU** :scroll:`)
                .setDescription(helpDescription)
            message.author.send({ embeds: [helpMenu] });
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}