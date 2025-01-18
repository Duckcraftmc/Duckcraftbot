const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Check the bot\'s ping.'),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true }); //Defer for long running commands
        await interaction.editReply(`Pong! **${interaction.client.ws.ping}ms**`);
    },
};