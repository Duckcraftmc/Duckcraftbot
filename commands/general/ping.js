const { SlashCommandBuilder, CommandInteraction, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Haal de ping status op.'),

    async execute(interaction, client, args) {
        try {

            var states = "🟢 Uitstekend";
            var states2 = "🟢 Uitstekend";

            var msg = `${Date.now() - interaction.createdTimestamp}`;
            var api = `${Math.round(client.ws.ping)}`;

            if(Number(msg) > 70) {
                states = "🟢 Goed";
            };

            if(Number(msg) > 170) {
                states = "🟡 Niet zo goed";
            };

            if(Number(msg) > 350) {
                states = "🔴 Slecht";
            };

            if(Number(api) > 70) {
                states2 = "🟢 Goed";
            };

            if(Number(api) > 170) {
                states2 = "🟡 Niet zo goed";
            };

            if(Number(api) > 350) {
                states2 = "🔴 Slecht";
            };

            let embed = new EmbedBuilder()
            embed.setTitle('🏓 PONG')
            embed.setColor('#ffe500')
            embed.setDescription(`**Bot:** ${msg + " ms | " + states}\n**Websocket:** ${api + " ms | " + states2}`)
            embed.setFooter({
                text: '© Duckcraft.nl',
            })
            embed.setTimestamp();

            interaction.followUp({
                embeds: [embed],
                flags: 64
            });

        } catch (error) {
            console.log(error);
        };
    }
};