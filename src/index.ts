import 'isomorphic-fetch';

import * as dotenv from 'dotenv';
import express, {
	Express,
	NextFunction,
	Request,
	Response,
	Router,
} from 'express';
import { Redis } from '@upstash/redis';
import { CommandsHandler } from './bot/commands-handler';
import { MarliMusic } from './bot/marli-music';
import { YtdlSourceStream } from './sources/ytdl-source/ytdl-source';
import { initSentry } from './config/sentry';
import { join } from 'path';

dotenv.config();
initSentry();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX;

const botHandler = new CommandsHandler(new YtdlSourceStream());

const redis = new Redis({
	token: process.env.REDIS_TOKEN,
	url: process.env.REDIS_URL,
});

new MarliMusic(
	{
		prefix: BOT_PREFIX,
		token: BOT_TOKEN,
	},
	botHandler,
	redis,
	{
		intents: [
			'Guilds',
			'GuildMessages',
			'MessageContent',
			'GuildVoiceStates',
			'DirectMessageReactions',
			'GuildEmojisAndStickers',
			'GuildMembers',
			'GuildMessageTyping',
			'GuildMessageReactions',
		],
	},
);

const server: Express = express();
const router = Router();
server.use(router);

const port = process.env.PORT || 3000;

router.get('/', (_request: Request, response: Response, next: NextFunction) => {
	const options = {
		root: join('public'),
	};
	return response.sendFile('index.html', options, (err) => {
		if (err) {
			next();
			console.log(err);
		}
	});
});

router.post('/health-check', (_request: Request, response: Response) => {
	return response.json({
		message: 'Ok',
	});
});

server.listen(port, () => {
	console.log(`Server listening to: ${port}`);
});
