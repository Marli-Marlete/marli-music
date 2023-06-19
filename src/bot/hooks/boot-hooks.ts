import { Message } from 'discord.js';
import {
	AudioPlayer,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { BOT_MESSAGES } from '../containts/default-messages';
import { logger } from '../../config/winston';
import { Queue } from '../../queue/queue';

export class BotHooks {
	constructor(
		private message: Message,
		private connection: VoiceConnection,
		private player: AudioPlayer,
		private queue: Queue,
	) {}

	startHooks() {
		this.player.on('error', (error: Error) => {
			logger.log('debug', 'player error', error);
		});

		this.player.on(AudioPlayerStatus.Idle, async () => {
			const connectionID = this.message.member.voice.channelId;
			const items = this.queue.getList(connectionID);

			if (!items.length) {
				this.message.reply({
					content: `${BOT_MESSAGES.PLAYLIST_ENDED} Bye!`,
				});
				this.connection.destroy();
			} else {
				const next = items[0];
				this.message.reply({
					content: `${this.message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${next.streamInfo.title}`,
				});
				this.player.play(next.audioResource);
				this.queue.pop(connectionID);
			}
		});

		this.connection.on('error', (error: Error) => {
			logger.log('info', 'connection error', error);
		});

		this.connection.on(VoiceConnectionStatus.Disconnected, () => {
			logger.log('info', 'disconnect');
			this.connection.destroy();
		});
	}
}
