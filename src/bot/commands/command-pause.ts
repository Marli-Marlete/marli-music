import { Message } from 'discord.js';
import { Command } from './command';
import { BOT_MESSAGES } from 'bot/containts/default-messages';

export class Pause extends Command {
	constructor() {
		super();
		this.name = 'pause';
	}
	async execute(message: Message, input: string): Promise<void> {
		this.player = this.getPlayer();
		if (this.getConnection(message)) {
			this.player.pause();
			message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_PAUSED}`,
			});
		}
	}
}
