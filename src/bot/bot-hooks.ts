import {
	AudioPlayer,
	AudioPlayerStatus,
	VoiceConnection,
	VoiceConnectionStatus,
} from '@discordjs/voice';

export function startBotHooks(
	connection: VoiceConnection,
	player: AudioPlayer,
) {
	connection.on('debug', (message) => {
		console.log('connection debug', message);
	});

	connection.on('error', (error: Error) => {
		console.log('connection error', error);
		connection.rejoin();
	});

	connection.on('stateChange', (oldState, newState) => {
		console.log(
			`connection changes from ${oldState.status} to ${newState.status} `,
		);
	});

	connection.on(VoiceConnectionStatus.Disconnected, () => {
		console.log('disconnect');
		connection.destroy();
	});

	player.on('stateChange', (oldState, newState) => {
		console.log(
			`audio player changes from ${oldState.status} to ${newState.status} `,
		);

		if (newState.status === AudioPlayerStatus.Paused) player.unpause();
	});

	player.on(AudioPlayerStatus.Idle, () => connection.destroy());
	player.on(AudioPlayerStatus.Playing, () => {
		console.log('Audio Player is currently playing');
	});
}