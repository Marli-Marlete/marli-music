import { Message } from 'discord.js';

import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	getVoiceConnection,
	joinVoiceChannel,
	VoiceConnection,
} from '@discordjs/voice';

import {
	makeAudioResource,
	SourceStream,
	StreamInfo,
} from '../sources/source-stream';
import { playFromQueue, startBotHooks } from './bot-hooks';
import { BOT_MESSAGES, sendCommandError } from './default-messages';
import { sentryCapture } from '../config/sentry';
import { logger } from '../config/winston';
import { ERRORS } from '../shared/errors';
import { queue } from 'queue/queue';

export class CommandsHandler {
	private player: AudioPlayer;

	constructor(private sourceStream: SourceStream) {}

	public async search(message: Message, input: string) {
		try {
			this.validateInput(message, input);
			this.getSourceStream();
			const results = await this.sourceStream.search(input);
			return message.reply({
				content: JSON.stringify(results),
			});
		} catch (err) {
			sendCommandError(err, message);
		}
	}

	public async play(message: Message, input: string) {
		try {
			if (!this.validateInput(message, input)) return;

			const voiceMember = message.member.voice;

			const connection = joinVoiceChannel({
				adapterCreator: voiceMember.guild.voiceAdapterCreator,
				channelId: voiceMember.channelId,
				guildId: String(voiceMember.guild.id),
			});
			this.getPlayer();
			console.log(typeof connection);
			connection.subscribe(this.player);

			this.getPlayer();
			const streamInfo = await this.getStream(message, input);
			queue.add(voiceMember.channelId, streamInfo);

			startBotHooks(
				connection,
				this.sourceStream,
				this.player,
				voiceMember.channelId,
			);
			if (this.player.state.status === AudioPlayerStatus.Idle)
				playFromQueue(this.sourceStream, this.player, voiceMember.channelId);
		} catch (err) {
			console.log('play error', err);
		}
	}

	public async pause(message: Message) {
		if (this.getConnection(message)) {
			this.player.pause();
			return message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_PAUSED}`,
			});
		}
	}

	public async resume(message: Message) {
		if (this.getConnection(message)) {
			this.player.unpause();
			return message.reply({
				content: `${message.author.username} ${BOT_MESSAGES.MUSIC_RESUMED}`,
			});
		}
	}

	public async stop(message: Message) {
		this.player.stop();
		return message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_STOPPED}`,
		});
	}

	public getPlayer() {
		try {
			if (!this.player)
				this.player = new AudioPlayer({
					debug: true,
				});
			return this.player;
		} catch (error) {
			logger.log('error', error);
			sentryCapture('audio.error', error);
		}
	}

	public setSourceStream(source: SourceStream) {
		this.sourceStream = source;
	}

	public getSourceStream() {
		return this.sourceStream;
	}

	public getConnection(message: Message) {
		return getVoiceConnection(message.member.voice.guild.id);
	}

	private validateInput(message: Message, input: string) {
		if (input.length > 1) return true;
		message.reply({ content: BOT_MESSAGES.INVALID_INPUT_MESSAGE });
		return false;
	}

	async getStream(message: Message, input: string): Promise<StreamInfo> {
		try {
			const video = await this.sourceStream.getStreamInfo(input);

			const searchResult = video ?? (await this.sourceStream.search(input));

			logger.log('debug', `input: ${input} ${video} >> ${searchResult}`);

			const info: StreamInfo = {
				url: video?.url || searchResult[0].url,
				title: video?.title || searchResult[0].title,
			};

			console.log('STREAM INFO', info);
			return info;
		} catch (err) {
			logger.log('error', ERRORS.RESULT_NOT_FOUND, err);
			sendCommandError(JSON.stringify(err), message);
		}
	}
}
