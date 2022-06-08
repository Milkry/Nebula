const helper = require('../helper_functions.js')

module.exports = {
    name: 'dmrickroll',
    description: 'Direct message a user with a rickroll gif',
    aliases: ['dmrr'],
    access: [process.env.OWNER_ID],
    run: async (client, message, args) => {
        // Access
        if (helper.hasAccess(module.exports.access, message.author.id)) return message.channel.send(helper.noPermission);

        // Command Parameters
        const targetUser = message.mentions.users.first();

        // Validate
        message.delete();
        if (!targetUser) {
            return message.author.send({ embeds: [await helper.createEmbedResponse(`:x: You did not mention a user.`, client.theme.Fail)] });
        }
        if (targetUser.id === process.env.OWNER_ID) {
            return message.author.send({ embeds: [await helper.createEmbedResponse(`:x: Nice try. You sussy baka!`, client.theme.Fail)] });
        }
        if (targetUser.id === client.config.clientId) {
            return message.author.send({ embeds: [await helper.createEmbedResponse(`:x: I can't rickroll my self...you goof ball.`, client.theme.Fail)] });
        }

        // Process
        const victim = client.users.cache.get(targetUser.id);
        if (victim) {
            victim.send('A little surprise from someone :slight3:')
            victim.send('https://tenor.com/view/challenge-find-out-when-this-gif-ends-rickroll-rickrolled-hidden-rickroll-gif-22493495')
        }
        else {
            console.error('Could not find victim in server cache.');
        }
    }
}