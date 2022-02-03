module.exports = {
    name: 'reload',
    description: 'Reloads a chosen command without needing to restart the bot',
    run: async (client, message, args) => {
      if (message.author.id !== client.config.myId) return;
  
      if (!args || args.length < 1) return message.reply(":x: Must provide a command name to reload.");
      const commandName = args[0];
      // Check if the command exists and is valid
      if (!client.commands.has(commandName)) {
        return message.reply(":x: This command does not exist");
      }
      // the path is relative to the *current folder*, so just ./filename.js
      delete require.cache[require.resolve(`./${commandName}.js`)];
      // We also need to delete and reload the command from the client.commands Enmap
      client.commands.delete(commandName);
      const props = require(`./${commandName}.js`);
      client.commands.set(commandName, props);
      message.reply(`:white_check_mark: The command ${commandName} has been reloaded`);
    }
}