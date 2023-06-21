import { Message } from 'discord.js';

import { AudioPlayerStatus, VoiceConnectionStatus } from '@discordjs/voice';

import { logger } from '../../../config/winston';
import { BOT_MESSAGES } from '../../containts/default-messages';
import { Command } from '../command';
import { MarliMusic } from '../../marli-music';
import { BotError } from '../../../shared/errors';

export class PlayHook extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
  }

  async execute(message: Message) {
    const connectionID = message.member.voice.channelId;
    const player = this.getPlayer(connectionID);
    const connection = this.getConnection(message);

    player.on('error', (error: Error) => {
      this.sendCommandError(
        new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
        message
      );
    });

    player.on(AudioPlayerStatus.Idle, () => {
      const queue = this.getQueue();
      const items = queue.getList(connectionID);

      if (!items.length) {
        message
          .reply({
            content: `${BOT_MESSAGES.PLAYLIST_ENDED}`,
          })
          .catch((error) =>
            this.sendCommandError(
              new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
              message
            )
          );
        connection.destroy();
      } else {
        const next = items[0];
        message
          .reply({
            content: `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${next.streamInfo.title}`,
          })
          .catch((error) => {
            this.sendCommandError(
              new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
              message
            );
          });
        player.play(next.audioResource);
        queue.pop(connectionID);
      }
    });

    connection.on('error', (error: Error) => {
      this.sendCommandError(
        new BotError(error.stack, BOT_MESSAGES.BOT_ERROR),
        message
      );
    });

    connection.on(VoiceConnectionStatus.Disconnected, () => {
      logger.log('info', 'disconnect');
      connection.destroy();
    });
  }
}
