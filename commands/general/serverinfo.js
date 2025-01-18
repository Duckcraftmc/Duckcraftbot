const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const config = require('../../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Krijg informatie over de server.'),

    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            return interaction.reply({ content: 'Dit command kan alleen in een server worden gebruikt.', ephemeral: true });
        }

        const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString()).join(', ') || 'Geen rollen'; //Sort roles by position
        const members = guild.memberCount; //Use memberCount for more accurate count
        const channels = guild.channels.cache.size;
        const createdTimestamp = guild.createdAt;
        const createdDate = new Date(createdTimestamp).toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
        const boostLevel = guild.premiumTier;
        const boostCount = guild.premiumSubscriptionCount;

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Server Informatie`)
            .setColor('#ffe500')
            .setThumbnail(guild.iconURL({ dynamic: true }) || null)
            .addFields(
                { name: 'Eigenaar', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Leden', value: members.toString(), inline: true },
                { name: 'Kanalen', value: channels.toString(), inline: true },
                { name: 'Aangemaakt op', value: createdDate, inline: true },
                { name: 'Boost Level', value: boostLevel.toString(), inline: true },
                { name: 'Boost Count', value: boostCount.toString(), inline: true },
                { name: 'Rollen', value: roles, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: '© Duckcraft.nl' });

        await interaction.followUp({ embeds: [embed], flags: 64 });
    },
}