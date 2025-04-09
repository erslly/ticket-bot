const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

module.exports = (client) => {
    const commands = [];

    function readCommands(dir) {
        const files = fs.readdirSync(dir);

        for (const file of files ) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                readCommands(filePath);
            } else if (file.endsWith('.js')) {
                const command = require(filePath);

                if('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON());
                    client.commands.set(command.data.name, command);
                    console.log(`${command.data.name} komutu yüklendi!`); 
                } else {
                    console.log(`[UYARI] ${filePath} komutunda data veya execute eksik`);
                }
            }
        }
    }

    readCommands(path.join(__dirname, '../commands'));

    const rest = new REST({version: '10'}).setToken(config.token);

    (async () => {
        try {
            console.log('Uygulama (/) komutları kaydediliyor..');

            const data = await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands}
            );

            console.log(`${data.length} komutu başarıyla kaydedildi!`)
        } catch (error) {
            console.error('Komut kaydetme hatası:', error)
        }
    })();
};