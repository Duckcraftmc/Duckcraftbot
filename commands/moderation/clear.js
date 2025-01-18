const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Verwijder berichten uit een kanaal.')
        .addIntegerOption(option =>
            option.setName('aantal')
                .setDescription('Het aantal berichten dat je wilt verwijderen.')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction, client) {
        try {

            interaction.followUp({
                content: "Berichten worden verwijderd...",
                ephemeral: true
            })
                .then(async () => {
                    const aantal = interaction.options.getInteger('aantal');
                    if (aantal > 100) {
                        interaction.followUp({
                            content: "Je kan maximaal 100 berichten verwijderen!",
                            flags: 64
                        })
                    } else {
                        interaction.channel.bulkDelete(aantal).then(async => {
                            const logChannelId = '1269630079949082645';
                            const logChannel = client.channels.cache.get(logChannelId);
                            const guild = interaction.guild;

                            const logEmbed = new EmbedBuilder()
                                .setTitle('Berichten verwijderd')
                                .setThumbnail(guild.iconURL({ dynamic: true }))
                                .setDescription(`Er zijn **${aantal}** berichten verwijderd in ${interaction.channel}\n\nBerichten verwijderd door: ${interaction.user.toString()}`)
                                .setColor('#ffe500')
                                .setFooter({
                                    text: '© Duckcraft.nl'
                                })
                                .setTimestamp();

                            logChannel.send({
                                embeds: [logEmbed]
                            })
                        })
                            .then(() => {
                                interaction.followUp({
                                    content: `${aantal} berichten verwijderd.`,
                                    flags: 64
                                })
                            })
                    }
                })

        } catch (error) {
            console.log(error);
        }
    }
}