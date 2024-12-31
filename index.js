const { Client, GatewayCloseCodes, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const soundPath = './sound';

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

// list of fart sounds mp3
const fartSounds = [];

// get all files in sound directory
fs.readdirSync('./sound').forEach(file => {
    fartSounds.push(file);
});

// login to discord
client.login(discordToken);

// when bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async function(message) {
    if (message.author.bot) return;

    if (message.content.match(/^prout$/i)) {

        // get random fart sound from fartSounds list
        const randomFartSound = fartSounds[Math.floor(Math.random() * fartSounds.length)];

        // path to random fart sound
        const randomFartSoundPath = `${soundPath}/${randomFartSound}`;

        // send fart sound in text channel
        message.channel.send({ files: [randomFartSoundPath] });
        
    }
});