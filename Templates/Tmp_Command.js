const helper = require('../Components/helper_functions.js');

module.exports = {
    active: true,
    name: 'Name of command',
    description: 'Your description here',
    aliases: [], // command aliases
    developerOnly: true, // True if the command should be ran only by the developer(s)
    permissionBypassers: [], // user ids (priority over guild permissions)
    permissions: [], // perms
    cooldown: 0,
    run: async (client, message, args) => {
        try {
            // Command Parameters
            // code

            // Validate
            // code

            // Process
            // code
        }
        catch (e) {
            helper.reportCommandError(e, client.theme.Fail, message, module.exports.name);
        }
    }
}