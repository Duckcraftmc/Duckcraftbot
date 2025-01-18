const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skin')
        .setDescription('Bekijk de skin van een speler.')
        .addStringOption(option =>
            option.setName('speler')
                .setDescription('De speler waarvan je de skin wilt bekijken.')
                .setRequired(true)),

    async execute(interaction, client) {
        try {

            interaction.followUp({
                content: "Skin is aan het laden",
                ephemeral: true
            })
                .then(async () => {
                    axios.get('https://api.mojang.com/users/profiles/minecraft/' + interaction.options.getString('speler'))
                        .then(function (response) {
                            if (response.data.id != null) {

                                let buttons = new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setLabel('Download skin')
                                            .setStyle(ButtonStyle.Link)
                                            .setURL(`https://visage.surgeplay.com/skin/${response.data.id}`)
                                    )

                                const embed = new EmbedBuilder()
                                    .setTitle(`Skin van ${interaction.options.getString('speler')}`)
                                    .setThumbnail('https://visage.surgeplay.com/skin/' + response.data.id)
                                    .setImage('https://visage.surgeplay.com/full/' + response.data.id)
                                    .setColor('#ffe500')
                                    .setFooter({
                                        text: '© Duckcraft.nl'
                                    })
                                    .setTimestamp();

                                interaction.followUp({
                                    embeds: [embed],
                                    components: [buttons],
                                    flags: 64
                                })
                            } else {
                                interaction.followUp({
                                    content: "Gebruiker niet gevonden!",
                                    flags: 64
                                });
                            };
                        }).catch(function (error) {
                        interaction.followUp({
                            content: "Er ging iets fout!",
                            flags: 64
                        })
                        console.log(error);
                    })
                })

        } catch (error) {
            console.log(error);
        }
    }
}