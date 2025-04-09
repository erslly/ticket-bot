const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');
const { connect } = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

client.commands = new Collection();
client.buttons = new Collection();

const commandHandler = require('./handlers/commandHandler');
const eventHandler = require('./handlers/eventHandler');

async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URI || 'MONGO DB URLNİZ');
        console.log('MongoDB başarıyla bağlandı!');
    } catch (error) {
        console.error('MongoDB ile bağlanırken bir hata oluştu:', error);
    }
}

async function init() {
    try {
        await connectToDatabase();
        commandHandler(client);
        eventHandler(client);
        await client.login(config.token);
    } catch (error) {
        console.error('Bot başlatılırken bir hatayla karşılaşıldı:', error);
    }
}

init();
