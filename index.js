//////////////////////////////////////////////////////////////
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const config = require("./config.json");
//////////////////////////////////////////////////////////////

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

// Startup
client.once('ready', () => {
	client.user.setPresence({ activities: [{ name: 'to your meme requests', type: "LISTENING" }], status: 'online' });
	console.log(' <!> Bot is Ready <!> ');
});

// We also need to make sure we're attaching the config to the CLIENT so it's accessible everywhere!
client.config = config;
client.commands = new Collection();

console.log(`Attempting to load commands...`);
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
	const commandName = file.split(".")[0];
	const command = require(`./commands/${file}`);
	
	client.commands.set(commandName, command);
	console.log(`loaded > ${commandName}`);
}

const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of events) {
  const eventName = file.split(".")[0];
  const event = require(`./events/${file}`);
  client.on(eventName, event.bind(null, client));
}

// Login to Discord with your client's token
client.login(config.token);