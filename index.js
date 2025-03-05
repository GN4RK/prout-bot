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
const miaouSounds = [];

// get all files in sound directory
fs.readdirSync('./sound/prout').forEach(file => {
    fartSounds.push(file);
});
fs.readdirSync('./sound/miaou').forEach(file => {
    miaouSounds.push(file);
});

// login to discord
client.login(discordToken);

let lastFartSound = null;
let lastMiaouSound = null;

// when bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async function(message) {
    if (message.author.bot) return;

    // prout command
    if (message.content.match(/^prout$/i)) {

        // get a random fart sound different from the last one
        let randomFartSound;
        do {
            randomFartSound = fartSounds[Math.floor(Math.random() * fartSounds.length)];
        } while (randomFartSound === lastFartSound);

        // save the last fart sound played
        lastFartSound = randomFartSound;

        // path to the random fart sound
        const randomFartSoundPath = `${soundPath}/prout/${randomFartSound}`;

        // send the fart sound
        message.channel.send({ files: [randomFartSoundPath] });
        
    }

    // miaou command
    if (message.content.match(/^miaou$/i)) {
        // get a random miaou sound
        let randomMiaouSound;
        do {
            randomMiaouSound = miaouSounds[Math.floor(Math.random() * miaouSounds.length)];
        } while (randomMiaouSound === lastMiaouSound);

        // save the last fart sound played
        lastMiaouSound = randomMiaouSound;

        // path to the random miaou sound
        const randomMiaouSoundPath = `${soundPath}/miaou/${randomMiaouSound}`;

        // send the miaou sound
        message.channel.send({ files: [randomMiaouSoundPath] });
    }

});