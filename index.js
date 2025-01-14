const { Client, GatewayIntentBits, Collection } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

const eventsPath = path.join(__dirname, 'events');
const commandsPath = path.join(__dirname, 'commands');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] het command in ${filePath} mist "data" of "execute" property.`);
    }
}

client.login(config.token).then(r => console.log(`[INFO] Ingelogd als ${client.user.tag}`)).catch(console.error);