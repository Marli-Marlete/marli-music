import { Message } from 'discord.js';
import { Command } from './command';
import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';

export class Resume extends Command {
	constructor(bot: MarliMusic) {
		super(bot);
		this.name = 'resume';
	}
	async execute(message: Message): Promise<void> {
		this.validate(message, 'resume');
		const connectionID = message.member.voice.channelId;
		const player = this.getPlayer(connectionID);
		player.unpause();
		message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_RESUMED}`,
		});
	}
}
