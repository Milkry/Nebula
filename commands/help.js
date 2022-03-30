const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'help',
    description: 'Displays a help menu',
    run: async (client, message, args) => {
        const access = [client.config.myId];
        const helpDescription = `
            Prefix: [ **.** ]
            \n> **rr/rickroll** *{channel_id}* : Bot joins the voice channel and starts playing rick roll
            \n> **dmrr** *{@user}* : DMs the specified user a little surprise :)
            \n> **disc/disconnect** : Disconnects the bot from the voice channel
            \n> **reload** *{command_name}* : Reloads a specified command
            \n> **nh/nhentai** *{code} [-s : sends as a dm]* : Responds with details about an nHentai code
            \n> **mon/monitor** *{(s)tatus}* : Displays a list of monitored voice channels
            \n> **mon/monitor** *{(g)lobal} {on/off}* : Enables/Disables global monitoring
            \n> **mon/monitor** *{channel_id/channel_name} {on/off}* : Enables/Disables monitoring of a specific channel`;
        if (!access.includes(message.author.id)) return;

        message.delete();
        const helpMenu = new MessageEmbed()
            .setColor('#4500d9')
            .setTitle('Help Menu')
            .setDescription(helpDescription)
        message.author.send({ embeds: [helpMenu] });
    }
}