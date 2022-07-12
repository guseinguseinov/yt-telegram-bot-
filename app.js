import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import ytdl from 'ytdl-core';
import { getData } from './data.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const token = process.env.TOKEN || "Your telegram bot token";
const bot = new TelegramBot(token, {polling: true});

if (!fs.existsSync(path.join(__dirname, 'music'))){
    fs.mkdirSync('music');
}

bot.onText(/\/start/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, `Welcome ${msg.from.username}\n/help to learn more`);
});

bot.onText(/\/help/, (msg) => {
    let chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Send me a youtube link and i will convert that to mp3 and send it to you :)');
});

bot.on('message', async (msg) => {
    let chatId = msg.chat.id;
    
    try {
        let {videoId, title} = await getData(msg.text);
        let deletedMessage;
        await bot.sendMessage(chatId, `Downloading...`)
        .then((result) => {
            deletedMessage = result.message_id;
        })

        let stream = ytdl(`https://youtube.com/watch?v=${videoId}`)
        .pipe(fs.createWriteStream(path.join(__dirname, 'music', `${videoId}.mp3`)));

        stream.on('finish', () => {
            bot.deleteMessage(chatId, deletedMessage);
            bot.sendAudio(chatId, path.join(__dirname, 'music', `${videoId}.mp3`), {caption: title});
        });
    }
    catch (e) {
        // in this case we do nothing 
    }
});
