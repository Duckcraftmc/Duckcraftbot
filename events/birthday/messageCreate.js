const { EmbedBuilder, Events } = require('discord.js');
const config = require('../../config');
const database = require('better-sqlite3');
const db = new database('verjaardagen.sqlite');
const cron = require('node-cron');

module.exports = {
    name: Events.MessageCreate,

    async execute(message, client) {
        async function sendBirthdayMessage() {
            const vandaag = new Date();
            const verjaardagen = db.prepare('SELECT user_id, dag, maand, jaar FROM verjaardagen').all();

            for (const verjaardag of verjaardagen) {
                const { user_id, dag, maand } = verjaardag;
                if (vandaag.getDate() === dag && vandaag.getMonth() + 1 === maand) {
                    const channel = client.channels.cache.get('1269625758913925302');
                    const member = client.guilds.cache.get(config.GuildId).members.cache.get(user_id);

                    if (channel && member) {
                        const EmbedBuilder = new EmbedBuilder()
                            .setDescription(`🎉 ${member} is vandaag jarig! 🎉`)
                            .setColor('#ffe500')

                        channel.send({ embeds: [EmbedBuilder] });
                    }
                }
            }
        }
        cron.schedule('0 0 * * *', () => {
            sendBirthdayMessage();
        });
    }
};