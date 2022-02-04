module.exports = {
    name: 'dmrr',
    description: 'Direct message a tagged user with a rickroll gif',
    run: async (client, message, args) => {
        // Checks
        if (message.author.id !== client.config.myId) return;
        if (!args[0]) { message.author.send(':x: No user was chosen. Please mention a user.\n**Command syntax:** .dmrr <@user>'); return; }
        const target = message.mentions.users.first();
        if (!target) { message.author.send(':x: Please mention a user.'); return; }
        if (target.id === client.config.clientId) { message.author.send(':x: I cannot rickroll myself. You sussy baka!'); return; }

        // Process cmd
        message.delete();
        const victim = client.users.cache.get(target.id);
        victim.send('Sup my buddha. Someone decided to send you this :eyes:')
        victim.send('https://tenor.com/view/rick-astly-rick-rolled-gif-22755440')
    }
}