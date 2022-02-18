//////////////////////////////////////////////////////////////
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const config = require("./config.json");
//////////////////////////////////////////////////////////////

// Create a new client instance
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

// Startup
client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'monke noises', type: "LISTENING" }], status: 'online' });
	global.channelBusyState = [false, false]; // we could change this to get the people who are already on the channels
	console.log(' <!> Bot is Ready <!> ');
});

// This makes the config file accessable from anywhere
client.config = config;
client.commands = new Collection();

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, (...args) => event.execute(...args, client));
}

console.log(`Attempting to load commands...`);
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const commandName = file.split(".")[0];
	const command = require(`./commands/${file}`);
	
	client.commands.set(commandName, command);
	console.log(`loaded > ${commandName}`);
}

// Login to Discord with your client's token
client.login(config.token);