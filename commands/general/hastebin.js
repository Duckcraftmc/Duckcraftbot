const { SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hastebin')
        .setDescription('Maak een hastebin aan.')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('De content die je in de hastebin wilt uploaden.')
                .setRequired(true)),

    async execute(interaction) {

        const { options } = interaction;
        const content = options.getString('content');

        const response = await axios.post('https://haste.sundeeptb.com/documents', content, { headers: { 'Content-Type': 'text/plain' } });

        if(response.status === 200) {
            const url = `https://haste.sundeeptb.com/${response.data.key}`;
            const guild = interaction.guild;

            const embed = new EmbedBuilder()
                .setDescription(`Je hastebin is aangemaakt!`)
                .setColor('#ffe500')

            let button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('Open haste')
                        .setStyle(ButtonStyle.Link)
                        .setURL(url)
                )

            interaction.followUp({
                embeds: [embed],
                components: [button],
                flags: 64
            });
        }
    }

}