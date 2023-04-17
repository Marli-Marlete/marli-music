import { Client, ClientOptions, Message } from 'discord.js';

import { CommandsHandler } from './commands-handler';
import { BOT_MESSAGES } from './default-messages';

interface BotInfo {
	prefix: string;
	token: string;
}

export class MarliMusic extends Client {
	prefix: string;

	constructor(
		private botInfo: BotInfo,
		private handler: CommandsHandler,
		options?: ClientOptions,
	) {
		super(options);

		this.prefix = botInfo.prefix;

		this.login(this.botInfo.token);

		this.once('ready', () => {
			this.healthCheck()
			setInterval(this.healthCheck.bind(this), 120_000);
		});

		this.once('reconnecting', () => {
			console.log('Reconnecting!');
		});
		this.once('disconnect', () => {
			console.log('Disconnect!');
		});

		this.on('messageCreate', async (message: Message) => {
			this.onMessage(message, this.prefix);
		});
	}

	public healthCheck() {
		return console.log(`${this.user.username} online ${this.uptime}`);
	}

	private async onMessage(message: Message, botPrefix: string) {
		if (message.author.bot) return;
		if (!message.content.startsWith(botPrefix)) return;

		const args = message.content.split(' ');
		const input = message.content.replace(args[0], '');
		const command = args[0].replace(botPrefix, '');

		switch (command) {
			case 'search':
				this.handler.search(message, input);
				break;
			case 'play':
				this.handler.play(message, input);
				break;
			case 'pause':
				this.handler.pause(message);
				break;
			case 'resume':
				this.handler.resume(message);
				break;
			case 'stop':
				this.handler.stop(message);
				break;
			default:
				message.reply(BOT_MESSAGES.INVALID_COMMAND);
		}
	}
}
