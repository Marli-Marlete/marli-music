import {
	AudioPlayer,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';
import { sentryCapture } from '../config/sentry';
import { fileLogger, logger } from '../config/winston';


export class BotHook {

	constructor(private connection: VoiceConnection, private player: AudioPlayer) {}

  	startBotHooks(): void {
		this.connection.on('debug', (message) => {
			logger.log('info', 'connection debug' + message );
		});

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

		this.player.on('stateChange', (oldState, newState) => {
			logger.log(
				'info',
				`audio player changes from ${oldState.status} to ${newState.status}`,
			);
		});

		this.player.on(AudioPlayerStatus.Idle, () => {
			if (this.connection.state.status !== VoiceConnectionStatus.Destroyed)
				this.connection.destroy();
		});

		this.player.on(AudioPlayerStatus.Playing, () => {
			logger.log('info', 'Audio Player is currently playing');
		});

		this.player.on('error', (error: Error) => {
			fileLogger.log('error', 'audio player error', error);
			sentryCapture('player.error', error);
		});
	}
}
