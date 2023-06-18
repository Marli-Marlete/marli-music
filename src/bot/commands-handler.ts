import { Message } from 'discord.js'

import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
	StreamType,
	VoiceConnection,
} from '@discordjs/voice';

import {
	makeAudioResource,
	SourceStream,
	StreamInfo,
} from '../sources/source-stream';
import { BotHook } from './bot-hooks';
import { BOT_MESSAGES, sendCommandError } from './default-messages';
import { sentryCapture } from '../config/sentry';
import { logger } from '../config/winston';
import { ERRORS } from '../shared/errors';
import { queue } from 'queue/queue';

export class CommandsHandler {
	private player: AudioPlayer;
	private botHook: BotHook;
	constructor(private sourceStream: SourceStream) {

	}

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
		
			
		if (!this.validateInput(message, input)) return;

		const voiceMember = message.member.voice;

		const connection = joinVoiceChannel({
			adapterCreator: voiceMember.guild.voiceAdapterCreator,
			channelId: voiceMember.channelId,
			guildId: String(voiceMember.guild.id),
		});
		this.getPlayer();

		this.botHook = new BotHook(connection, this.sourceStream, this.player, voiceMember.channelId);
		this.botHook.startBotHooks();

		try {
			const video = await this.sourceStream.getStreamFromUrl(input);

			const searchResult = video ?? (await this.sourceStream.search(input));

			const stream = await this.sourceStream.getStream(
				video?.url ?? searchResult[0].url,
			);

			const resource = createAudioResource(stream, {
				inputType: StreamType.Opus,
			});

			if (!resource.readable) throw new Error (ERRORS.RESOURCE_ERROR)
			
			logger.log("info", `valid resource:${resource.readable}`)

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

			
			if (this.player.state.status === AudioPlayerStatus.Idle)
				this.botHook.playFromQueue(this.sourceStream, this.player, voiceMember.channelId);
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

	public validateInput(message: Message, input: string) {
		if (input.length > 1) return true;
		message.reply({ content: BOT_MESSAGES.INVALID_INPUT_MESSAGE });
		return false;
	}

	async getStream(message: Message, input: string): Promise<StreamInfo> {
		try {
			const video = await this.sourceStream.getStreamFromUrl(input);

			const searchResult = video ?? (await this.sourceStream.search(input));

			logger.log('debug', `input: ${input} ${video} >> ${searchResult}`);

			const info: StreamInfo = {
				url: video?.url || searchResult[0].url,
				title: video?.title || searchResult[0].title,
			};

			return info;
		} catch (err) {
			logger.log('error', ERRORS.RESULT_NOT_FOUND, err);
			sendCommandError(JSON.stringify(err), message);
		}
	}
}
