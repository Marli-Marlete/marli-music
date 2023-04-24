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
import { BOT_MESSAGES } from './default-messages';

export async function playFromQueue(
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

export function startBotHooks(
	connection: VoiceConnection,
	sourceStream: SourceStream,
	player: AudioPlayer,
	channelId: string,
) {
	connection.on('error', (error: Error) => {
		connection.rejoin();
		fileLogger.log('error', 'connection error', error);
		sentryCapture('connection.error', error);
	});

	connection.on('stateChange', (oldState, newState) => {
		logger.log(
			'info',
			`connection changes from ${oldState.status} to ${newState.status} `,
		);
	});

	connection.on(VoiceConnectionStatus.Disconnected, () => {
		logger.log('info', 'disconnect');
		connection.destroy();
	});

	connection.on(VoiceConnectionStatus.Ready, async () => {
		logger.log('debug', 'CONNECTION READY');
	});

	player.on('stateChange', (oldState, newState) => {
		logger.log(
			'info',
			`audio player changes from ${oldState.status} to ${newState.status}`,
		);
	});

	player.on(AudioPlayerStatus.Idle, async () => {
		logger.log('debug', `PLAYER IS IDLE, MY CHANNEL ID: ${channelId}`);
		playFromQueue(sourceStream, player, channelId);
	});

	player.on(AudioPlayerStatus.Playing, () => {
		logger.log('info', 'Audio Player is currently playing');
	});

	player.on('error', (error: Error) => {
		fileLogger.log('error', 'audio player error', error);
		sentryCapture('player.error', error);
	});
}
