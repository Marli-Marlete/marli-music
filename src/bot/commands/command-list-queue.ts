import { Message } from 'discord.js';
import { BOT_MESSAGES } from '../containts/default-messages';
import { Command } from './command';
import { MarliMusic } from '../marli-music';
import { fragmentContent } from '@/helpers/helpers';

export class ListQueue extends Command {
  async execute(message: Message<boolean>): Promise<void> {
    try {
      await this.validate(message, 'list');
      const connectionID = message.member.voice.channelId;
      const queue = this.getQueue();
      const queueList = queue.getList(connectionID);

      if (!queueList?.length) {
        message.reply(BOT_MESSAGES.PLAYLIST_EMPTY);
        return;
      }

      const itemsToShow = queueList
        .map(
          (item, index) =>
            `\n${index + 1} - ${item.streamInfo.title} - ${
              item.streamInfo.artist
            }\t`
        )
        .join('');

      fragmentContent(
        itemsToShow,
        MarliMusic.MAX_REPLY_CONTENT_LENGTH,
        '\t'
      ).forEach(async (fragment) => {
        await message.reply(fragment);
      });
    } catch (error) {
      await this.sendCommandError(error, message);
    }
  }
}
