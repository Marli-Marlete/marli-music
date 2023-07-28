import { Message } from 'discord.js';
import { Command } from './command';
import { MarliMusic } from '../marli-music';
import { LyricsSearch } from '@/sources/source-lyrics';

export class ShowLyrics extends Command {
  constructor(protected bot: MarliMusic) {
    super(bot);
    this.name = 'lyrics';
  }
  async execute(message: Message<boolean>): Promise<void> {
    try {
      this.validate(message, 'show lyrics');
      const queue = this.getQueue();
      const items = queue.getList(message.member.voice.channelId);
      const current = items.shift();

      const { userSearch, streamInfo } = current;

      const search: LyricsSearch = {
        artist: streamInfo.artist,
        title: streamInfo.title,
        userSearch,
      };

      const lyrics = await this.bot.sourceLyrics.getLyrics(search);
      console.log({ lyrics });
      message.channel.send(lyrics);
    } catch (error) {
      this.sendCommandError(error, message);
    }
  }
}
