////////////////////////// Imports ///////////////////////////
require('dotenv').config();
const { Client, Collection, Intents } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const config = require("./config.json");
const Database = require("./Database/Database.js");
//////////////////////////////////////////////////////////////

///////////////////////// Variables ///////////////////////////
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
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_PRESENCES,
	]
});

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

	// Connect to database
	await mongoose.connect(process.env.DATABASE_URI, { keepAlive: true })
		.then(() => console.log(' [!] Connection to database established! [!] '))
		.catch(e => console.error(' [X] Connection to database ended in failure. [X] \n', e));

	// Presence
	client.user.setPresence({ activities: [{ name: 'the stars...', type: "WATCHING" }], status: 'online' });
	setInterval(() => {
		client.user.setPresence({ activities: [{ name: 'the stars...', type: "WATCHING" }], status: 'online' });
	}, 1800000);

	// Ready
	console.log(' <!> Bot is Ready <!> ');
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