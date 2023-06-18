import { SourceStream } from './../sources/source-stream';
import { Client, ClientOptions, Message } from 'discord.js';
import { BOT_MESSAGES } from './containts/default-messages';
import { sentryCapture } from '../config/sentry';
import { logger } from '../config/winston';
import { ERRORS } from 'shared/errors';
import { Queue } from 'queue/queue';
import { Search, Play, Pause, Resume, Stop, Command } from './commands/';
import { AudioPlayer } from '@discordjs/voice';

export interface BotInfo {
	prefix: string;
	token: string;
}

export const ALL_COMMANDS: Record<string, any> = {
	pause: Pause,
	play: Play,
	resume: Resume,
	search: Search,
	stop: Stop,
};

export class MarliMusic extends Client {
	prefix: string;
	players: Map<string, AudioPlayer> = new Map();

	constructor(
		private botInfo: BotInfo,
		public sourceStream: SourceStream,
		public queue: Queue,
		options?: ClientOptions,
	) {
		super(options);

		this.prefix = botInfo.prefix;

		this.login(this.botInfo.token).catch((reason) => {
			logger.log('error', ERRORS.BOT_STARTUP_ERROR, reason);
			sentryCapture(ERRORS.BOT_STARTUP_ERROR, new Error(reason));
		});

		this.once('ready', () => {
			this.healthCheck();
		});

		this.on('error', (error: Error) => {
			logger.log('error', ERRORS.BOT_STARTUP_ERROR, error);
			sentryCapture(ERRORS.BOT_STARTUP_ERROR, error);
		});

		this.on('messageCreate', async (message: Message) => {
			this.onMessage(message, this.prefix);
		});
	}

	public healthCheck() {
		const healthString = `${this.user.username} online ${this.uptime}`;
		logger.log('debug', healthString);
		return healthString;
	}

	public addPlayer(connection: string) {
		this.players.set(connection, new AudioPlayer());
	}

	public getPlayer(connection: string) {
		if (!this.players.has(connection)) {
			this.addPlayer(connection);
		}

		return this.players.get(connection);
	}

	public removePlayer(connection: string) {
		this.players.delete(connection);
	}

	private async onMessage(message: Message, botPrefix: string) {
		if (message.author.bot) return;
		if (!message.content.startsWith(botPrefix)) return;
		if (!this.validate(message)) return;

		const args = message.content.split(' ');
		const input = message.content.replace(args[0], '');
		const commandString = args[0].replace(botPrefix, '');

		if (!ALL_COMMANDS[commandString])
			message.reply(BOT_MESSAGES.INVALID_COMMAND);

		const command: Command = new ALL_COMMANDS[commandString](
			this.sourceStream,
			this.queue,
		);

		command.execute(this, message, input);
	}

	private validate(message: Message) {
		const voiceChannel = message.member.voice.channel;
		if (!voiceChannel) {
			message.channel.send(BOT_MESSAGES.NOT_IN_A_VOICE_CHANNEL);
			return false;
		}

		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has('Connect') || !permissions.has('Speak')) {
			message.channel.send(BOT_MESSAGES.NO_PERMISSION_JOIN_SPEAK);
			return false;
		}
		return true;
	}
}
