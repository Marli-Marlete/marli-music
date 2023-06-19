import 'isomorphic-fetch';
import { MarliMusic } from './marli-music';
import { PlayDlSourceStream } from '../sources/play-dl-source/play-dl-source';
import { LocalQueue } from '../queue/queue';

import * as dotenv from 'dotenv';
dotenv.config();

export function botStartup() {
	const botInfo = {
		prefix: process.env.BOT_PREFIX,
		token: process.env.BOT_TOKEN,
	};
	const queue = new LocalQueue();
	const sourceStream = new PlayDlSourceStream();

	const marliMusic = new MarliMusic(botInfo, sourceStream, queue, {
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
	});

	return marliMusic;
}
