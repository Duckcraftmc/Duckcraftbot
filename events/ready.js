const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        client.user.setPresence({
            activities: [{
                name: 'play.duckcraft.nl',
                type: ActivityType.Playing,
            }], status: 'dnd',
        });
    }
}