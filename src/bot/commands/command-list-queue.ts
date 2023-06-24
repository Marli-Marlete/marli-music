import { Message } from 'discord.js';
import { Command } from './command';
import { BOT_MESSAGES } from '../containts/default-messages';

export class ListQueue extends Command {
  async execute(message: Message<boolean>): Promise<void> {
    try {
      await this.validate(message, 'list');
      const connectionID = message.member.voice.channelId;
      const queue = this.getQueue();
      const queueList = queue.getList(connectionID);
      const content = !queueList?.length
        ? BOT_MESSAGES.PLAYLIST_EMPTY
        : queueList
            .map((item, index) => `\n${index + 1} - ${item.streamInfo.title}`)
            .join(' ');
      await message.reply(content);
    } catch (error) {
      await this.sendCommandError(error, message);
    }
  }
}
