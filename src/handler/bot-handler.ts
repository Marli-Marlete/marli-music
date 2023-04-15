import { Message } from 'discord.js';
import { Player } from 'player/player';
import { Searcher } from 'searchers/searcher';
import { ERRORS } from 'shared/errors';

export const BOT_MESSAGES: Record<string, string> = {
	INVALID_COMMAND: process.env.INVALID_COMMAND || 'INVALID COMMAND',
	NOT_IN_A_VOICE_CHANNEL:
		process.env.NOT_IN_A_VOICE_CHANNEL || `YOU'RE NOT IN A VOICE CHANNEL`,
	NO_PERMISSION_JOIN_SPEAK:
		process.env.NO_PERMISSION_JOIN_SPEAK ||
		'I HAVE NO PERMISSION TO JOIN OR SPEAK',
};

export class BotHandler {
	constructor(
		private prefix: string,
		private token: string,
		private player?: Player,
		private searcher?: Searcher,
	) {}

	private validate(message: Message) {
		const args = message.content.split(' ');
		const voiceChannel = message.member.voice.channel;

		if (!voiceChannel)
			return message.channel.send(BOT_MESSAGES.NOT_IN_A_VOICE_CHANNEL);

		const permissions = voiceChannel.permissionsFor(message.client.user);

		if (!permissions.has('Connect') || !permissions.has('Speak'))
			return message.channel.send(BOT_MESSAGES.NO_PERMISSION_JOIN_SPEAK);
	}

	public async search(input: string) {
		if (!this.searcher) throw new Error(ERRORS.NO_SEARCHER_ENGINE);
		return this.searcher.search(input);
	}

	public async play() {
		return this.player.play();
	}
	public async pause() {
		return this.player.pause();
	}
	public async resume() {
		return this.player.resume();
	}
	public async stop() {
		return this.player.stop();
	}

	public getPrefix(): string {
		return this.prefix;
	}

	public setSearcher(searcher: Searcher) {
		this.searcher = searcher;
	}

	public setPlayer(player: Player) {
		this.player = player;
	}
}
