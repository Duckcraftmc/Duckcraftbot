const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const config = require('../../config');
const database = require('better-sqlite3');
const db = new database('verjaardagen.sqlite');
const table = db.prepare(`  CREATE TABLE IF NOT EXISTS verjaardagen (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, dag INTEGER, maand INTEGER, jaar INTEGER)`);

table.run();

function age1(dag, maand, jaar) {
    const vandaag = new Date();
    const verjaardag = new Date(jaar, maand - 1, dag);
    let leeftijd = vandaag.getFullYear() - verjaardag.getFullYear();
    const maandDiff = vandaag.getMonth() - verjaardag.getMonth();
    if (maandDiff < 0 || (maandDiff === 0 && vandaag.getDate() < verjaardag.getDate())) {
        leeftijd--;
    }
    return leeftijd;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verjaardag')
        .setDescription('Verjaardag subcommands')
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription('Stel je verjaardag in.')
                .addIntegerOption(option =>
                    option.setName('dag')
                        .setDescription('De dag waarop je jarig bent.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('maand')
                        .setDescription('De maand waarin je jarig bent.')
                        .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('jaar')
                        .setDescription('Het jaar waarin je jarig bent.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('view')
                .setDescription('Bekijk je verjaardag.'))
        .addSubcommand(subcommand =>
            subcommand.setName('list')
                .setDescription('Bekijk de lijst met iedereen ze verjaardag.')),

    async execute(interaction) {

        const command = interaction.options.getSubcommand();

        switch (command) {
            case `set`:
                try {

                    const dag = interaction.options.getInteger('dag');
                    const maand = interaction.options.getInteger('maand');
                    const jaar = interaction.options.getInteger('jaar');
                    const bestaandeData = db.prepare('SELECT * FROM verjaardagen WHERE user_id = ?').get(interaction.user.id);
                    let guild = interaction.guild;
                    let guildIconURL = guild.iconURL({ dynamic: true, size: 4096 });

                    if (bestaandeData) {
                        const embed = new EmbedBuilder()
                            .setColor('#ffe500')
                            .setDescription(`⚠️ Je hebt al een verjaardag ingesteld op \` ${bestaandeData.dag}/${bestaandeData.maand}/${bestaandeData.jaar} \`.`);

                        await interaction.followUp({
                            embeds: [embed],
                            flags: 64
                        });

                    } else {
                        const verjaardagdb = db.prepare(`INSERT OR REPLACE INTO verjaardagen (user_id, dag, maand, jaar) VALUES (?, ?, ?, ?)`).run(interaction.user.id, dag, maand, jaar);
                        const leeftijd = age1(dag, maand, jaar);

                        const embed = new EmbedBuilder()
                            .setTitle('Verjaardag ingesteld!')
                            .setColor('#ffe500')
                            .setThumbnail(guildIconURL)
                            .setDescription(`✅ Je geboortedatum is ingesteld op \` ${dag}/${maand}/${jaar} \`.\nJe bent nu \`${leeftijd}\` jaar oud!`)
                            .setFooter({
                                text: '© Duckcraft.nl'
                            })
                            .setTimestamp();
                        await interaction.followUp({
                            embeds: [embed],
                            flags: 64
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
        }

        switch (command) {
            case `list`:
                try {

                    const verjaardagen = db.prepare(`SELECT user_id, dag, maand, jaar FROM verjaardagen`).all();
                    if (verjaardagen.length === 0) {
                        const embed = new EmbedBuilder()
                            .setDescription('Er zijn nog geen verjaardagen ingesteld! Doe dit met `/verjaardag set`.')
                            .setColor('#ffe500')

                        return interaction.followUp({
                            embeds: [embed],
                            flags: 64
                        });

                    }
                    const verjaardagenLijst = verjaardagen.map((data) => {
                        const { user_id, dag, maand, jaar } = data;
                        const volgendeVerjaardag = new Date(new Date().getFullYear(), maand - 1, dag);

                        if(new Date() > volgendeVerjaardag) {
                            volgendeVerjaardag.setFullYear(volgendeVerjaardag.getFullYear() + 1);
                        }

                        const tijdTotVerjaardag = volgendeVerjaardag - new Date();
                        const dagenTotVerjaardag = Math.ceil(tijdTotVerjaardag / (1000 * 60 * 60 * 24));
                        return `${interaction.guild.members.cache.get(user_id)}: ${dag}/${maand}/${volgendeVerjaardag.getFullYear()} (over ${dagenTotVerjaardag} dag${dagenTotVerjaardag > 1 ? 'en' : ''})`;
                    });

                    let guild = interaction.guild;
                    let guildIconURL = guild.iconURL({ dynamic: true, size: 4096 });

                    const embed = new EmbedBuilder()
                        .setTitle('Verjaardagen')
                        .setColor('#ffe500')
                        .setThumbnail(guildIconURL)
                        .setDescription(verjaardagenLijst.join('\n'))
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

        switch (command) {
            case `view`:
                try {

                    const verjaardagdb = db.prepare(`SELECT dag, maand, jaar FROM verjaardagen WHERE user_id = ?`);
                    const data = verjaardagdb.get(interaction.user.id);
                    if (!data) {

                        const embed = new EmbedBuilder()
                            .setDescription('Je hebt nog geen verjaardag ingesteld! Doe dit met `/verjaardag-set`.')
                            .setColor('#ffe500')

                        return interaction.followUp({
                            embeds: [embed],
                            flags: 64
                        });
                    }

                    const { dag, maand, jaar } = data;
                    const vandaag = new Date();
                    const volgendeVerjaardag = new Date(vandaag.getFullYear(), maand - 1, dag);

                    if (vandaag > volgendeVerjaardag) {
                        volgendeVerjaardag.setFullYear(volgendeVerjaardag.getFullYear() + 1);
                    }
                    const tijdTotVerjaardag = volgendeVerjaardag - vandaag;
                    const dagenTotVerjaardag = Math.ceil(tijdTotVerjaardag / (1000 * 60 * 60 * 24));
                    const maandenTotVerjaardag = Math.floor(dagenTotVerjaardag / 30);
                    const resterneDagen = dagenTotVerjaardag % 30;
                    let guild = interaction.guild;
                    let guildIconURL = guild.iconURL({ dynamic: true, size: 4096 });

                    let h = '';

                    if (maandenTotVerjaardag > 0) {
                        h += `${maandenTotVerjaardag} maand${maandenTotVerjaardag > 1 ? 'en' : ''}`;
                    }

                    if (resterneDagen > 0) {
                        h += `, ${resterneDagen} dag${resterneDagen > 1 ? 'en' : ''}`;
                    }

                    const embed = new EmbedBuilder()
                        .setTitle('Verjaardag')
                        .setColor('#ffe500')
                        .setThumbnail(guildIconURL)
                        .setDescription(`Je volgende verjaardag is op \`${dag}/${maand}/${volgendeVerjaardag.getFullYear()}\`.\nDat is over \`${h}\`.`)
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
}