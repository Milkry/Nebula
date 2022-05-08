////////////////////////// Imports ///////////////////////////
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const config = require("./config.json");
//////////////////////////////////////////////////////////////

///////////////////////// Variables ///////////////////////////
let monitorVoiceChannelsGlobal = true;
let Zyjen = '190881082894188544';
let Backy = '307947376725721089';
let Nana = '544194307414949898';
let monitorList = [
	{
		channelName: 'Penthouse',
		channelId: '797450771628163103',
		access: [config.myId, Zyjen, Backy],
		active: true,
	},
	{
		channelName: 'Boardroom',
		channelId: '553253000987279360',
		access: [config.myId, Backy, Nana],
		active: true,
	},
	{
		channelName: 'Study Lounge',
		channelId: '952180093550202890',
		access: [config.myId, Backy, Nana],
		active: true,
	}/*,
	{
		channelName: 'General',
		channelId: '920652294322806788',
		access: [config.myId, '878207188672327690'],
		active: true,
	}*/
];
let theme = {
	Neutral: "#bf52ff",
	Success: "#7aff14",
	Fail: "#ff1428",
	Notification: "#fcba03"
}
//////////////////////////////////////////////////////////////

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

// Start
client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'monke noises', type: "LISTENING" }], status: 'online' });
	global.channelBusyState = [false, false]; // we could change this to get the people who are already on the channels
	console.log(' <!> Bot is Ready <!> ');
});

// This makes variables accessible from anywhere
client.config = config;
client.monitor = monitorVoiceChannelsGlobal;
client.monitorList = monitorList;
client.theme = theme;
client.commands = new Collection();

// Event Handler
const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
	const eventName = file.split(".")[0];
	const event = require(`./events/${file}`);
	client.on(eventName, (...args) => event.execute(...args, client));
}

// Command Handler
console.log(`=================================`);
console.log(`Attempting to load commands...`);
console.log(`=================================`);
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const commandName = file.split(".")[0];
	const command = require(`./commands/${file}`);

	client.commands.set(commandName, command);
	console.log(`loaded > ${commandName}`);
}
console.log(`=================================`);

// Login to Discord with your client's token
client.login(config.token);