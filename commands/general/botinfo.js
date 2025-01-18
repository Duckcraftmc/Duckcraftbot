const { SlashCommandBuilder, EmbedBuilder, version } = require('discord.js');
const config = require('../../config');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botinfo')
        .setDescription('Krijg informatie over de bot.'),


    async execute(interaction, client) {

        try {
            await client.user.fetch();

            let totalSeconds = (client.uptime / 1000);
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);

            let uptime = `${days} dagen, ${hours} uren, ${minutes} minuten en ${seconds} seconden`;
            let guild = interaction.guild;
            let guildIconURL = guild.iconURL({ dynamic: true, size: 4096 });

            const embed = new EmbedBuilder()
                .setTitle('Bot Informatie')
                .setColor('#ffe500')
                .setThumbnail(guildIconURL)
                .setDescription(`💻 **Gemaakt door:** <@430282288295575552> \n\n⛔ **Naam:** \`${client.user.tag}\`\n🆔 **ID:** \`${client.user.id}\`\n📤 **Uptime**: \`${uptime}\`\n💻 **Systeem:** \`${os.type()}\`\n💻 **CPU Model:** \`${os.cpus()[0].model}\`\n⛔ **CPU Gebruik:** \`${(process.cpuUsage().system / 1024 / 1024).toFixed(2) + '%'}\`\n📦 **Node.js Versie:** \`${process.version}\`\n📦 **Discord.js Versie:** \`${version}\`\n📡 **Ping:** \`${client.ws.ping}ms\``)
                .setFooter({
                    text: '© Duckcraft.nl'
                })
                .setTimestamp();

            await interaction.followUp({
                embeds: [embed],
                flags: 64
            });

        } catch (error) {
            console.log(error);
        }

    }
}