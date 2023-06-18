import { Message } from 'discord.js'

import {
    AudioPlayer, createAudioResource, getVoiceConnection, joinVoiceChannel, StreamType
} from '@discordjs/voice'

import { sentryCapture } from '../config/sentry'
import { logger } from '../config/winston'
import { ERRORS } from '../shared/errors'
import { SourceStream } from '../sources/source-stream'
import { startBotHooks } from './bot-hooks'
import { BOT_MESSAGES, sendCommandError } from './default-messages'

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
		if (!this.validateInput(message, input)) return;

		const voiceMember = message.member.voice;

		const connection = joinVoiceChannel({
			adapterCreator: voiceMember.guild.voiceAdapterCreator,
			channelId: voiceMember.channelId,
			guildId: String(voiceMember.guild.id),
		});
		this.getPlayer();

		startBotHooks(connection, this.player);

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
			
			this.player.play(resource)
			logger.log("info", `valid resource:${resource.readable}`)

			const subscription = connection.subscribe(this.player);

			if (!subscription || !subscription.player) throw new Error(ERRORS.SUBSCRIPTION_ERROR)

			return message.reply({
				content: `${BOT_MESSAGES.CURRENT_PLAYING} ${
					video?.title ?? searchResult[0].title
				}`,
			});
		} catch (err) {
			logger.log("error", err)
			sendCommandError(JSON.stringify(err), message);
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
			if (!this.player) this.player = new AudioPlayer({
				debug: true
			});
		return this.player;
		} catch(error) {
			logger.log('error', error);
			sentryCapture("audio.error", error)
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
}
