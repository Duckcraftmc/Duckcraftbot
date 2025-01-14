module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        const command = client.commands.get(interaction.commandName);
        if(!command) {
            console.log(`[WARNING] Het command ${interaction.commandName} bestaat niet.`);
        } try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(`[ERROR] ${error}`);
            await interaction.reply({ content: 'Er is een fout opgetreden met het uitvoeren van het command.', ephemeral: true });
        }
    }
}