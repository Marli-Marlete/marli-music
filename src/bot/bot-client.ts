import { Client, Message } from 'discord.js';
import { BotHandler } from 'bot/bot-handler';
import { ClientOptions } from 'discord.js';

export class MarliMusic extends Client {
	constructor(
		private prefix: string,
		public token: string,
		options?: ClientOptions,
		private handler?: BotHandler,
	) {
		super(options);
		if (!handler) this.handler = new BotHandler();
		this.login(this.token);
		this.once('ready', () => {
			console.log(this.user.username, 'ready');
		});

		this.once('reconnecting', () => {
			console.log('Reconnecting!');
		});
		this.once('disconnect', () => {
			console.log('Disconnect!');
		});

		this.on('messageCreate', async (message: Message) => {
			console.log('New message', message.content);
			this.handler.onMessage(message, this.prefix);
		});
	}

	public getPrefix(): string {
		return this.prefix;
	}
}
