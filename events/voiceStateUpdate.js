module.exports = {
    name: 'voiceStateUpdate',
    execute(oldState, newState, client) {
        // Medusa Server
        const guildId = "553181786117767169";
        // Penthouse Channel
        const channelId = "797450771628163103";
        // People to monitor for [Milkry, Zyjen]
        const memberIds = [client.config.myId, '190881082894188544'];

        // If the channel the user left is the Penthouse AND is also empty AND the user that left is either me or zyjen, then do something
        if (oldState.channelId === channelId && oldState.channel.members.size === 0 && memberIds.includes(oldState.member.id)) { // LEAVE
            global.penthouseBusy = false;
            return;
        }
        // If the event is NOT from the Penthouse, then exit
        if (newState.channelId !== channelId) return;
        // If the Penthouse has someone in it, then exit
        if (global.penthouseBusy) return;

        // If Milkry connected then notify Zyjen
        if (memberIds[0] === newState.member.id) { // JOIN
            client.users.fetch(memberIds[1])
                .then(user => {
                    user.send(`${newState.member.displayName} joined the penthouse channel. Hop on BIG BOI.`);
                    global.penthouseBusy = true;
                }).catch(error => console.error(error));
        } else if (memberIds[1] === newState.member.id) { // If Zyjen connected then notify Milkry
            client.users.fetch(memberIds[0])
                .then(user => {
                    user.send(`${newState.member.displayName} joined the penthouse channel. Hop on BIG BOI.`);
                    global.penthouseBusy = true;
                }).catch(error => console.error(error));
        }
    },
};