const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

let connection;

const intents = new Intents([
  'GUILDS',
  'GUILD_MESSAGES',
  'GUILD_MEMBERS',
  'MESSAGE_CONTENT',
]);

const client = new Client({ intents, partials: ['CHANNEL', 'MESSAGE', 'USER', 'GUILD_MEMBER', 'REACTION'] });

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath)

  if('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    console.log("Loaded command: " + command.data.name)
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

connection = require("./database/db")

client.login(config.general.token);