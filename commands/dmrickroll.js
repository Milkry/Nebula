const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'dmrickroll',
    description: 'Direct message a user with a rickroll gif',
    aliases: ['dmrr'],
    access: [process.env.OWNER_ID],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
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
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}