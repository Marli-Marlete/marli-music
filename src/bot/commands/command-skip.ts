import { Message } from 'discord.js';

import { createEmbedMessage } from '@/helpers/helpers';

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

        const embedMessage = createEmbedMessage({
          url: next.streamInfo?.source?.url ?? next.streamInfo.url,
          author: {
            name: next.streamInfo.artist,
            url: next.streamInfo.url,
            icon_url: next.streamInfo?.thumbnail?.url,
          },
          title: next.streamInfo.title,
          footer: {
            text: message.author.username,
          },
          thumbnail: {
            url: next.streamInfo?.thumbnail?.url,
          },
        });

        await message.channel.send({
          content: BOT_MESSAGES.MUSIC_SKIPPED,
          embeds: [embedMessage],
        });

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
