const { Client, GatewayCloseCodes, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
    ]
});

const discordToken = process.env.DISCORD_TOKEN;

client.login(discordToken);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async function(message) {
    if (message.author.bot) return;

    if (message.content.match(/^prout$/)) {
        message.reply('Caca');

        // send fart sound in text channel
        const fartSound = path.join(__dirname + "/sound", 'fart.mp3');
        message.channel.send({ files: [fartSound] });
        
    }
});