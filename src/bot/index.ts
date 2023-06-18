import 'isomorphic-fetch';
import * as dotenv from 'dotenv';

import { CommandsHandler } from './commands-handler';
import { MarliMusic } from './marli-music';
import { PlayDlSourceStream } from 'sources/play-dl-source/play-dl-source';

dotenv.config();

export function botStartup() {
	const BOT_TOKEN = process.env.BOT_TOKEN;
	const BOT_PREFIX = process.env.BOT_PREFIX;

	const botHandler = new CommandsHandler(new PlayDlSourceStream());

	return new MarliMusic(
		{
			prefix: BOT_PREFIX,
			token: BOT_TOKEN,
		},
		botHandler,
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
