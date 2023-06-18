import { Message } from 'discord.js';
import { Command } from './command';
import { BOT_MESSAGES } from 'bot/containts/default-messages';

export class Resume extends Command {
	constructor() {
		super();
		this.name = 'resume';
	}
	async execute(message: Message, input: string): Promise<void> {
		if (this.getConnection(message)) {
			this.player.unpause();
			message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_RESUMED}`,
			});
		}
	}
}
