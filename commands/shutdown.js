const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'shutdown',
    description: 'Shutsdown the bot',
    aliases: [],
    developerOnly: true,
    permissionBypassers: [],
    permissions: [],
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Process
            process.exit();
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}