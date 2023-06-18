import { Message } from 'discord.js';
import { BOT_MESSAGES } from '../containts/default-messages';
import { AudioPlayer, getVoiceConnection } from '@discordjs/voice';
import { MarliMusic } from 'bot/marli-music';

export abstract class Command {
	name: string;
	protected player: AudioPlayer;

	abstract execute(
		bot: MarliMusic,
		message: Message,
		input: string,
	): Promise<void>;

	getPlayer(): AudioPlayer {
		return !this.player ? new AudioPlayer({ debug: true }) : this.player;
	}

	public getConnection(message: Message) {
		return getVoiceConnection(message.member.voice.guild.id);
	}

	validate(message: Message, input: string): boolean {
		if (input.length) return true;
		message.reply({ content: BOT_MESSAGES.INVALID_INPUT_MESSAGE });
		return false;
	}
}
