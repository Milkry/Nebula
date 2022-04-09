const helper = require('../helper_functions.js')

module.exports = {
  name: 'reload',
  description: 'Reloads a command without needing to restart the bot',
  aliases: ['rel'],
  run: async (client, message, args) => {
    // Access
    const access = [client.config.myId];
    if (!access.includes(message.author.id)) return;

    // Command Parameters
    const commandName = args[0];

    // Validate
    if (!commandName) {
      return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: Must provide a command to reload.`, client.theme.Fail)] });
    }
    if (!client.commands.has(commandName)) { // Check if the command exists and is valid
      return message.channel.send({ embeds: [await helper.createEmbedResponse(`:x: This command does not exist.`, client.theme.Fail)] });
    }

    // Process
    delete require.cache[require.resolve(`./${commandName}.js`)];
    // We also need to delete and reload the command from the client.commands Enmap
    client.commands.delete(commandName);
    const props = require(`./${commandName}.js`);
    client.commands.set(commandName, props);
    message.channel.send({ embeds: [await helper.createEmbedResponse(`:white_check_mark: **${commandName}** has been reloaded.`, client.theme.Success)] });
  }
}