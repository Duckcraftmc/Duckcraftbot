const { CommandInteraction, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {
        await interaction.deferReply({ flags: 64 });

        if(!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if(!command) {
            interaction.editReply({
                content: "Er ging iets fout tijdens het uitvoeren van je command",
                flags: 64
            });
        }

        command.execute(interaction, client);
    }
}