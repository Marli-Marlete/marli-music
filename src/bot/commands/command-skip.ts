import { Message } from 'discord.js';
import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { Command } from './command';

export class Skip extends Command {
	constructor(bot: MarliMusic) {
		super(bot);
		this.name = 'skip';
	}
	async execute(message: Message) {
		try {
			await this.validate(message, 'skip');
			const connectionID = message.member.voice.channelId;
			const player = this.getPlayer(connectionID);
			const queue = this.getQueue();
			const playlist = queue.getList(connectionID);

			if (playlist.length) {
				const next = playlist[0];
				await message.reply({
					content: `${message.author.username} ${BOT_MESSAGES.MUSIC_SKIPPED} ${next.streamInfo.title}`,
				});
				player.play(next.audioResource);
				queue.pop(connectionID);
			} else {
				queue.clear(connectionID);
				player.stop();
			}
		} catch (error) {
			await this.sendCommandError(error, message);
		}
	}
}
