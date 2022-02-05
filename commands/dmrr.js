module.exports = {
    name: 'dmrr',
    description: 'Direct message a target user with a rickroll gif',
    run: async (client, message, args) => {
        const access = [client.config.myId];
        // Checks
        if (!access.includes(message.author.id)) return;
        if (!args[0]) { message.author.send(':x: No user was chosen. Please mention a user.\n**Command syntax:** .dmrr <@user>'); return; }
        const target = message.mentions.users.first();
        if (!target) { message.author.send(':x: Please mention a user.'); return; }
        if (target.id === client.config.clientId) { message.author.send(`:x: You can't rickroll me. You sussy baka!`); return; }

        // Process cmd
        message.delete();
        const victim = client.users.cache.get(target.id);
        if (victim) {
            victim.send('Sup my buddha. Someone decided to send you this.')
            victim.send('https://tenor.com/view/challenge-find-out-when-this-gif-ends-rickroll-rickrolled-hidden-rickroll-gif-22493495')
        }
    }
}