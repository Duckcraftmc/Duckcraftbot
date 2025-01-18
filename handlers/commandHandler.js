const { REST, Routes } = require('discord.js');
const config = require('../config.json');
const fs = require('node:fs');

async function loadCommands(client) {

    const commands = [];
    const commandsFolder = fs.readdirSync("./commands");

    for (const folder of commandsFolder) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));


        for (const file of commandFiles) {
            const command = require(`../commands/${folder}/${file}`);
            await client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    }

    const rest = new REST().setToken(config.token);

    await (async () => {
        try {
            const data = await rest.put(
                Routes.applicationGuildCommands(config.ClientId, config.GuildId),
                {body: commands},
            );
            return console.log(`\x1b[31m[COMMANDS] \x1b[91mSuccesfully loaded ${data.length} commands!\x1b[97m`);
        } catch (error) {
            console.error(error);
        }
    })();
};

module.exports = {
    loadCommands
};