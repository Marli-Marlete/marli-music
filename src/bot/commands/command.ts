import { Message } from 'discord.js'

import { AudioPlayer, getVoiceConnection } from '@discordjs/voice'

import { BOT_MESSAGES } from '../containts/default-messages'
import { MarliMusic } from '../marli-music'

export abstract class Command {
  name: string;

  constructor(private bot: MarliMusic) {}

	abstract execute(message: Message, input: string): Promise<void>;

	getPlayer(connectionID: string): AudioPlayer {
	  return this.bot.getPlayer(connectionID);
	}

	getQueue() {
	  return this.bot.queue;
	}

	getSourceStream() {
	  return this.bot.sourceStream;
	}

	public getConnection(message: Message) {
	  return getVoiceConnection(message.member.voice.guild.id);
	}

	validate(message: Message, input: string): boolean {
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

	  if (!input.length) {
	    message.reply({ content: BOT_MESSAGES.INVALID_INPUT_MESSAGE });
	    return false;
	  }

	  return true;
	}
}
