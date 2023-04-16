import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { MarliMusic } from 'bot/bot-client';
import { BotHandler } from 'bot/bot-handler';
import { YtdlSourceStream } from 'sources/ytdl-source/ytdl-source';
dotenv.config();

const server: Express = express();

const port = process.env.PORT || 3000;
server.get('/', (_request: Request, response: Response) => {
	return response.sendFile('./public/index.html', { root: '.' });
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX;

const botHandler = new BotHandler(new YtdlSourceStream());

new MarliMusic(BOT_PREFIX, BOT_TOKEN, botHandler, {
	intents: [
		'Guilds',
		'GuildMessages',
		'MessageContent',
		'GuildVoiceStates',
		'DirectMessageReactions',
		'GuildEmojisAndStickers',
		'GuildMembers',
		'GuildMessageTyping',
	],
});

server.listen(port, () => {
	console.log(`Server listening to: ${port}`);
});
