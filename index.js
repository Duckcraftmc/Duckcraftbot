const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');

const config = require('./config');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.User,
    ]
});

client.queue = new Map();
client.commands = new Collection();

client.login(config.token).then(() => {
    console.log(`\x1b[32m[INFO] \x1b[92mLogged in as ${client.user.tag}!\x1b[97m`);

    loadCommands(client).then(r => {
        console.log(r);
    });
    loadEvents(client);

}).catch(
    (error) => {
        console.log(error);
        console.error(error);
    });