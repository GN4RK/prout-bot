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

function randomSound(type) {
    switch (type) {
        case "prout":
            return randomFart();
        case "miaou":
            return randomMiaou();
        case "random":
            let nb = Math.floor(Math.random() * 2);
            if (nb == 0) return randomFart();
            return randomMiaou();
    }
}

function randomFart() {
    // get a random fart sound different from the last one
    let randomFartSound;
    do {
        randomFartSound = fartSounds[Math.floor(Math.random() * fartSounds.length)];
    } while (randomFartSound === lastFartSound);

    // save the last fart sound played
    lastFartSound = randomFartSound;

    // path to the random fart sound
    return `${soundPath}/prout/${randomFartSound}`;
}

function randomMiaou() {
    // get a random miaou sound
    let randomMiaouSound;
    do {
        randomMiaouSound = miaouSounds[Math.floor(Math.random() * miaouSounds.length)];
    } while (randomMiaouSound === lastMiaouSound);

    // save the last fart sound played
    lastMiaouSound = randomMiaouSound;

    // path to the random miaou sound
    return `${soundPath}/miaou/${randomMiaouSound}`;
}

client.on('messageCreate', async function(message) {
    if (message.author.bot) return;

    // prout command
    if (message.content.match(/^prout$/i)) {
        // send the fart sound
        message.channel.send({ files: [randomFart()] });
    }

    // miaou command
    if (message.content.match(/^miaou$/i)) {
        // send the miaou sound
        message.channel.send({ files: [randomMiaou()] });
    }

    // random
    if (message.content.match(/^random$/i)) {
        // send random sound
        message.channel.send({ files: [randomSound()] });
    }

});