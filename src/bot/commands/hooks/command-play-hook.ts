import { Message } from 'discord.js';

import { BOT_MESSAGES } from '@/bot/containts/default-messages';
import { MarliMusic } from '@/bot/marli-music';
import { logger } from '@/config/winston';
import { BotError } from '@/shared/errors';
import { AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

import { Command } from '../command';
import { Skip } from '../command-skip';

export class PlayHook extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
  }

  async execute(message: Message) {
    const connectionID = message.member.voice.channelId;
    const player = this.getPlayer(connectionID);
    const connection = this.getConnection(message);

    player.on('error', async (error: Error) => {
      await this.sendCommandError(
        new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
        message
      );
    });

    player.on(AudioPlayerStatus.Idle, async () => {
      const skip = new Skip(this.bot);
      await skip.execute(message);
    });

    connection.on('error', async (error: Error) => {
      await this.sendCommandError(
        new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
        message
      );
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      logger.log('info', 'disconnect');
      connection.destroy();
      const connectionID = message.member.voice.channelId;
      this.removePlayer(connectionID);
    });
  }
}
