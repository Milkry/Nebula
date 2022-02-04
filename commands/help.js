module.exports = {
    name: 'help',
    description: 'Displays a help menu',
    run: async (client, message, args) => {
        if (message.author.id !== client.config.myId) return;

        message.delete();
        message.author.send('For now the menu is empty...'); // make this in embedded
    }
}