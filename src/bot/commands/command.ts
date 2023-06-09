import { Message } from 'discord.js';
import { AudioPlayer, getVoiceConnection } from '@discordjs/voice';
import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { BotError, ERRORS } from '../../shared/errors';
import { logger } from '../../config/winston';
import { sentryCapture } from '../../config/sentry';

export abstract class Command {
  name: string;

  constructor(protected bot: MarliMusic) {}

  abstract execute(message: Message, input?: string): Promise<void>;

  getPlayer(connectionID: string): AudioPlayer {
    return this.bot.getPlayer(connectionID);
  }

  removePlayer(connectionID: string) {
    this.bot.removePlayer(connectionID);
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

  async validate(message: Message, input: string): Promise<boolean> {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      throw new BotError(
        ERRORS.INVALID_COMMAND_USAGE,
        BOT_MESSAGES.NOT_IN_A_VOICE_CHANNEL
      );
    }

    const permissions = voiceChannel.permissionsFor(message.client.user);

    if (!permissions.has('Connect') || !permissions.has('Speak')) {
      throw new BotError(
        ERRORS.INVALID_COMMAND_USAGE,
        BOT_MESSAGES.NO_PERMISSION_JOIN_SPEAK
      );
    }

    if (!input.length) {
      throw new BotError(
        ERRORS.INVALID_COMMAND_USAGE,
        BOT_MESSAGES.INVALID_INPUT_MESSAGE
      );
    }

    return true;
  }

  async sendCommandError(error: BotError, message: Message) {
    logger.debug('error', error.stack, error);
    await message.reply({
      content: error.userMessage || BOT_MESSAGES.BOT_ERROR,
    });
    sentryCapture(ERRORS.RESOURCE_ERROR, error);
  }
}
