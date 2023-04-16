import { Message } from 'discord.js';

import { BOT_MESSAGES } from './default-messages';

import {
	AudioPlayer,
	StreamType,
	VoiceConnection,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import { SourceStream } from './sources/source-stream';

import { startBotHooks } from './bot-hooks';
import { PlayDlSourceStream } from './sources/play-dl-source/play-dl.source';

export class BotHandler {
	private player: AudioPlayer;

	constructor(private sourceStream?: SourceStream) {}

	public async onMessage(message: Message, botPrefix: string) {
		if (message.author.bot) return;
		if (!message.content.startsWith(botPrefix)) return;

		const args = message.content.split(' ');
		const input = message.content.replace(args[0], '');
		const command = args[0].replace(botPrefix, '');

		switch (command) {
			case 'search':
				this.search(message, input);
				break;
			case 'play':
				this.play(message, input);
				break;
			case 'pause':
				this.pause(message, input);
				break;
			case 'resume':
				this.resume(message, input);
				break;
			case 'stop':
				this.stop(message, input);
				break;
			default:
				message.reply(BOT_MESSAGES.INVALID_COMMAND);
		}
	}

	public async search(message: Message, input: string) {
		this.validateInput(message, input);
		this.getSourceStream();
		const results = await this.sourceStream.search(input);
		return message.reply({
			content: JSON.stringify(results),
		});
	}

	public async play(message: Message, input: string) {
		this.validateStatus(message);
		this.validateInput(message, input);

		const voiceMember = message.member.voice;

		let connection: VoiceConnection;

		connection = getVoiceConnection(voiceMember.guild.id);
		if (!connection)
			connection = joinVoiceChannel({
				channelId: voiceMember.channelId,
				guildId: String(voiceMember.guild.id),
				adapterCreator: voiceMember.guild.voiceAdapterCreator,
			});

		this.getPlayer();
		this.getSourceStream();
		startBotHooks(connection, this.player);

		const searchResult = await this.sourceStream.search(input);
		const stream = await this.sourceStream.getStream(searchResult[0].url);

		const resource = createAudioResource(stream, {
			inputType: StreamType.Arbitrary,
		});

		this.player.play(resource);
		connection.subscribe(this.player);

		return message.reply({
			content: `${BOT_MESSAGES.CURRENT_PLAYING} ${searchResult[0].title}`,
		});
	}
	public async pause(message: Message, input: string) {
		this.player.pause();
		return message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_PAUSED}`,
		});
	}
	public async resume(message: Message, input: string) {
		this.player.unpause();
		return message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_RESUMED}`,
		});
	}
	public async stop(message: Message, input: string) {
		this.player.stop();
		return message.reply({
			content: `${message.author.username} ${BOT_MESSAGES.MUSIC_STOPPED}`,
		});
	}

	public getPlayer() {
		if (!this.player) this.player = new AudioPlayer();
		return this.player;
	}

	public setSourceStream(source: SourceStream) {
		this.sourceStream = source;
	}

	public getSourceStream() {
		if (!this.sourceStream) this.sourceStream = new PlayDlSourceStream();
		return this.sourceStream;
	}

	private validateStatus(message: Message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel)
			return message.channel.send(BOT_MESSAGES.NOT_IN_A_VOICE_CHANNEL);

		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has('Connect') || !permissions.has('Speak'))
			return message.channel.send(BOT_MESSAGES.NO_PERMISSION_JOIN_SPEAK);
	}

	private validateInput(message: Message, input: string) {
		if (input.length < 1)
			return message.reply({ content: BOT_MESSAGES.INVALID_INPUT_MESSAGE });
	}
}
