import 'isomorphic-fetch';
import * as dotenv from 'dotenv';
import { Redis } from '@upstash/redis';

import { CommandsHandler } from './commands-handler';
import { MarliMusic } from './marli-music';
import { YtdlSourceStream } from '../sources/ytdl-source/ytdl-source';

dotenv.config();

export function botStartup() {
	const BOT_TOKEN = process.env.BOT_TOKEN;
	const BOT_PREFIX = process.env.BOT_PREFIX;

	const botHandler = new CommandsHandler(new YtdlSourceStream());

	const redis = new Redis({
		token: process.env.REDIS_TOKEN,
		url: process.env.REDIS_URL,
	});

	return new MarliMusic(
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
}
