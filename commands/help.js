const { MessageEmbed } = require("discord.js");
const helper = require('../helper_functions.js')

module.exports = {
    name: 'help',
    description: 'Displays a help menu',
    run: async (client, message, args) => {
        const access = [client.config.myId];
        if (!access.includes(message.author.id)) return;

        const helpDescription = `
            Prefix: [ **.** ]

            **rr/rickroll** *{channel_id}* : Bot joins the voice channel and starts playing rick roll
            **dmrr/dmrickroll** *{@user}* : DMs the specified user a little surprise :)
            **disc/disconnect** : Disconnects the bot from the voice channel
            **rel/reload** *{full_command_name}* : Reloads a specified command
            **nh/nhentai** *{code} [-s : sends as a dm]* : Responds with details about an nHentai code
            **mon/monitor** *{(s)tatus}* : Displays a list of monitored voice channels
            **mon/monitor** *{(g)lobal} {on/off}* : Enables/Disables global monitoring
            **mon/monitor** *{channel_id/channel_name} {on/off}* : Enables/Disables monitoring for a specific channel
        `;

        message.delete();
        const helpMenu = new MessageEmbed()
            .setColor('#4500d9')
            .setTitle('Help Menu')
            .setDescription(helpDescription)
        message.author.send({ embeds: [helpMenu] });
    }
}