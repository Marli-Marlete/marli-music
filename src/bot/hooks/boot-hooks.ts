import {
	AudioPlayer,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { logger } from 'config/winston';
import { Message } from 'discord.js';
import { Queue } from 'queue/queue';

export class BotHooks {
	constructor(
		private message: Message,
		private connection: VoiceConnection,
		private player: AudioPlayer,
		private queue: Queue,
	) {}

	startHooks() {
		this.player.on('error', (error: Error) => {
			console.log('player error', error);
		});

		this.player.on(AudioPlayerStatus.Idle, async () => {
			const items = this.queue.getList(this.message.channelId);
			if (!items) return;
			const next = items.shift();
			this.player.play(next.audioResource);
			this.queue.pop(this.message.channelId);
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
