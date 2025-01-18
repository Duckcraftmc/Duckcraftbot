const fs = require('fs');
const config = require('../config');

function loadEvent(client) {
    const folders = fs.readdirSync('./events');

    for (const folder of folders) {
        const files = fs.readdirSync(`.//events/${folder}`).filter((file) => file.endsWith(".js"));

        for (const file of files) {
            const event = require(`../events/${folder}/${file}`);

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }

    return console.log(`\x1b[34m[EVENTS] \x1b[94mSuccesfully loaded ${folders.length} events!\x1b[97m`);

}

module.exports = {
    loadEvent
}