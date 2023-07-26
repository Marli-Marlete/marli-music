import { Message } from 'discord.js';

import { ResultAudioSearch } from '@/sources/source-stream';

import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { Command } from './command';
import { Stop } from './command-stop';

export class Skip extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
    this.name = 'skip';
  }
  async execute(message: Message) {
    try {
      await this.validate(message, 'skip');
      const connectionID = message.member.voice.channelId;
      const player = this.getPlayer(connectionID);
      const queue = this.getQueue();
      const playlist = queue.getList(connectionID);
      if (playlist?.length > 1) {
        const next = playlist[1];

        if (!next.streamInfo?.url) {
          next.streamInfo.url = await this.getResourceUrl(
            next.streamInfo.title,
            next.streamInfo.artist
          );
        }

        const audioResource = await this.getAudioResource(next.streamInfo.url);

        await message.reply(
          `${BOT_MESSAGES.MUSIC_SKIPPED} ${next.streamInfo.title} - ${next.streamInfo.artist}`
        );
        player.play(audioResource);
        queue.pop(connectionID);
      } else {
        player.removeAllListeners();
        const stop = new Stop(this.bot);
        await stop.execute(message);
      }
    } catch (error) {
      await this.sendCommandError(error, message);
    }
  }
}
