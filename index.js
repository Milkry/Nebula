////////////////////////// Imports ///////////////////////////
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { ActivityType } = require('discord-api-types/v10');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require("./config.json");
const Database = require("./Database/Database.js");
//////////////////////////////////////////////////////////////

///////////////////////// Variables //////////////////////////
const theme = {
	Neutral: "#bf52ff",
	Success: "#7aff14",
	Fail: "#ff1428",
	Notification: "#fcba03"
}
//////////////////////////////////////////////////////////////

// Create a new client instance
const client = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
	]
})

// This makes variables accessible from anywhere
client.config = config;
client.theme = theme;
client.Database = Database;
client.commands = new Collection();

// Start
client.once('ready', async () => {
	// Handlers
	InitializeEventHandler();
	InitializeCommandHandler();

	// Presence
	const presence = { activities: [{ name: 'the stars...', type: ActivityType.Watching }], status: 'online' };
	client.user.setPresence(presence);
	setInterval(() => {
		client.user.setPresence(presence);
	}, 1800000);

	// Connect to database
	await mongoose.connect(process.env.DATABASE_URI, { keepAlive: true })
		.then(() => console.log('[✓] Connection to database established! [✓]'))
		.catch(e => console.error('[X] Connection to database ended in failure.[X]\n', e));

	// Ready
	console.log('[✓] Ready [✓]');
});

// Event Handler
function InitializeEventHandler() {
	const events = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
	for (const file of events) {
		const eventName = file.split(".")[0];
		const event = require(`./events/${file}`);
		client.on(eventName, (...args) => event.execute(...args, client));
	}
}

// Command Handler
function InitializeCommandHandler() {
	console.log(`=============================`);
	console.log(`Loading all commands...`);
	console.log(`=============================`);
	const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
	for (const file of commandFiles) {
		const commandName = file.split(".")[0];
		const command = require(`./commands/${file}`);

		client.commands.set(commandName, command);
		console.log(`loaded > ${commandName}`);
	}
	console.log(`=============================`);
}

// Bot Login
client.login(process.env.TOKEN);