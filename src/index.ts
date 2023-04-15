import express, { Express, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import Discord from 'discord.js';
import { BOT_MESSAGES, BotHandler } from 'handler/bot-handler';
import { YtSearch } from 'searchers/yt-searcher/yt-search';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const BOT_PREFIX = process.env.BOT_PREFIX;

const botHandler = new BotHandler(BOT_PREFIX, BOT_TOKEN);

const client = new Discord.Client({
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

client.login(BOT_TOKEN);

client.once('ready', () => {
	console.log('bot ready', client.user.username);
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});
client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('messageCreate', async (message: Discord.Message) => {
	console.log('New message', message.content);

	const botPrefix = botHandler.getPrefix();

	if (message.author.bot) return;
	if (!message.content.startsWith(botPrefix)) return;

	const args = message.content.split(' ');
	const input = message.content.replace(args[0], '');
	const command = args[0].replace(botPrefix, '');

	switch (command) {
		case 'search':
			message.reply(`${message.author.username} > search > ${input}`);
			botHandler.setSearcher(new YtSearch());
			const results = await botHandler.search(input);
			message.reply({
				content: JSON.stringify(results),
			});
			break;
		case 'play':
			message.reply(`${message.author.username} > play > ${input}`);
			break;
		default:
			message.channel.send(BOT_MESSAGES.INVALID_COMMAND);
	}
});

const server: Express = express();

const port = process.env.PORT || 3000;
server.get('/', (request: Request, response: Response) => {
	return response.sendFile('./public/index.html', { root: '.' });
});

server.listen(port, () => console.log(`Server listening to: ${port}`));
