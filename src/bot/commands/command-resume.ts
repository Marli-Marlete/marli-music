import { Message } from 'discord.js';
import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { Command } from './command';

export class Resume extends Command {
	constructor(bot: MarliMusic) {
		super(bot);
		this.name = 'resume';
	}
	async execute(message: Message): Promise<void> {
		try {
			await this.validate(message, 'resume');
			const connectionID = message.member.voice.channelId;
			const player = this.getPlayer(connectionID);
			player.unpause();
			await message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_RESUMED}`,
			});
		} catch (error) {
			await this.sendCommandError(error, message);
		}
	}
}
