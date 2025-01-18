const { ActivityType, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const activities = [{
            name: `play.duckcraft.nl`, type: ActivityType.Custom, url: 'https://duckcraft.nl',
        }];

        const status = ['dnd'];

        let i = 0;
        setInterval(() => {
            if (i >= activities.length) i = 0;
            client.user.setActivity(activities[i].name, {
                type: activities[i].type,
                url: activities[i].url
            });
            i++;
        }, 50000);

        let s = 0;
        setInterval(() => {
            client.user.setStatus(status[s]);
            s = (s + 1) % status.length;
        }, 5000);

    }
}