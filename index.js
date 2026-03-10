const { Client, GatewayIntentBits, Partials } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const soundPath = './sound';
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

function randomSound(message) {
    console.log('Random Type');
    let nb = Math.floor(Math.random() * 2);
    if (nb == 0) return randomFart(message);
    return randomMiaou(message);
}

function randomFart(message) {
    const serverName = message.guild ? message.guild.id + ":" + message.guild.name : 'DM';
    addLog('info', 'Random Fart', serverName);
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

function randomMiaou(message) {
    const serverName = message.guild ? message.guild.id + ":" + message.guild.name : 'DM';
    addLog('info', 'Random Miaou', serverName);
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

function addLog(level, message, server = "", channel = "", author = "")
{
    let infos = {
        timestamp: getNowFormat(),
        level: level,
        message: message
    };

    if (server) infos.server = server;
    if (channel) infos.channel = channel;
    if (author) infos.author = author;

    if (level == "error") {
        console.error(JSON.stringify(infos));
        return;
    }

    console.log(JSON.stringify(infos));
}

function getNowFormat()
{
    const dateObj = new Date();
    let year = dateObj.getFullYear();
    let month = dateObj.getMonth();
    month = ('0' + (month + 1)).slice(-2);
    // To make sure the month always has 2-character-format. For example, 1 => 01, 2 => 02

    let date = dateObj.getDate();
    date = ('0' + date).slice(-2);
    // To make sure the date always has 2-character-format

    let hour = dateObj.getHours();
    hour = ('0' + hour).slice(-2);
    // To make sure the hour always has 2-character-format

    let minute = dateObj.getMinutes();
    minute = ('0' + minute).slice(-2);
    // To make sure the minute always has 2-character-format

    let second = dateObj.getSeconds();
    second = ('0' + second).slice(-2);
    // To make sure the second always has 2-character-format

    return `${year}-${month}-${date}T${hour}:${minute}:${second}`;
}



client.on('messageCreate', async function(message) {
    if (message.author.bot) return;

    // prout command
    if (message.content.match(/^prout$/i)) {
        // send the fart sound
        message.channel.send({ files: [randomFart(message)] });
    }

    // miaou command
    if (message.content.match(/^miaou$/i)) {
        // send the miaou sound
        message.channel.send({ files: [randomMiaou(message)] });
    }

    // random
    if (message.content.match(/^random$/i)) {
        // send random sound
        const file = randomSound(message);
        const ext = path.extname(file);

        message.channel.send({ files: [{
            attachment: file,
            name: `secret${ext}`
        }] });
    }

});