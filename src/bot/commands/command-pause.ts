import { Message } from 'discord.js';
import { MarliMusic } from '../marli-music';
import { Command } from './command';
import { BOT_MESSAGES } from '../containts/default-messages';

export class Pause extends Command {
	constructor(bot: MarliMusic) {
		super(bot);
		this.name = 'pause';
	}
	async execute(message: Message): Promise<void> {
		if (this.getConnection(message)) {
			const connectionID = message.member.voice.channelId;
			const player = this.getPlayer(connectionID);
			player.pause();
			message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_PAUSED}`,
			});
		}
	}
}
