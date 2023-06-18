import {
	AudioPlayer,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { sentryCapture } from '../config/sentry';
import { fileLogger, logger } from '../config/winston';
import { SourceStream, makeAudioResource } from 'sources/source-stream';
import { queue } from 'queue/queue';


export class BotHook {

	constructor(private connection: VoiceConnection,
		private sourceStream: SourceStream,
		private player: AudioPlayer,
		private channelId: string) {}

  	startBotHooks(): void {
		this.connection.on('error', (error: Error) => {
			this.connection.rejoin();
			fileLogger.log('error', 'connection error', error);
			sentryCapture('connection.error', error);
		});
	
		this.connection.on('stateChange', (oldState, newState) => {
			logger.log(
				'info',
				`connection changes from ${oldState.status} to ${newState.status} `,
			);
		});
	
		this.connection.on(VoiceConnectionStatus.Disconnected, () => {
			logger.log('info', 'disconnect');
			this.connection.destroy();
		});
	
		this.connection.on(VoiceConnectionStatus.Ready, async () => {
			logger.log('debug', 'CONNECTION READY');
		});
	
		this.player.on('stateChange', (oldState, newState) => {
			logger.log(
				'info',
				`audio player changes from ${oldState.status} to ${newState.status}`,
			);
		});
	
		this.player.on(AudioPlayerStatus.Idle, async () => {
			logger.log('debug', `PLAYER IS IDLE, MY CHANNEL ID: ${this.channelId}`);
			this.playFromQueue(this.sourceStream, this.player, this.channelId);
		});
	
		this.player.on(AudioPlayerStatus.Playing, () => {
			logger.log('info', 'Audio Player is currently playing');
		});
	
		this.player.on('error', (error: Error) => {
			fileLogger.log('error', 'audio player error', error);
			sentryCapture('player.error', error);
		});
	}

	async  playFromQueue(
		sourceStream: SourceStream,
		player: AudioPlayer,
		channelId: string,
	) {
		const list = queue.getList(channelId);
		const firstItem = list.shift();
		if (!firstItem) return;
	
		queue.pop();
	
		const audioData = await makeAudioResource(sourceStream, {
			url: firstItem.url,
			title: firstItem.title,
		});
		player.play(audioData);
	}
}
