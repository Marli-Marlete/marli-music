import { Message } from 'discord.js';
import { Command } from './command';
import { BOT_MESSAGES } from 'bot/containts/default-messages';

export class Stop extends Command {
	constructor() {
		super();
		this.name = 'stop';
	}
	async execute(message: Message, input: string): Promise<void> {
		this.player.stop();
		message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_STOPPED}`,
		});
	}
}
