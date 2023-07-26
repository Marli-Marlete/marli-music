import { Message } from 'discord.js';

import { ResultAudioSearch, StreamInfo } from '@/sources/source-stream';
import { AudioPlayerStatus, joinVoiceChannel } from '@discordjs/voice';

import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { Command } from './command';
import { PlayHook } from './hooks/command-play-hook';

export class Play extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
    this.name = 'play';
  }
  async execute(message: Message, input: string) {
    try {
      await this.validate(message, input);

      const voiceMember = message.member.voice;

      const connection = joinVoiceChannel({
        adapterCreator: voiceMember.guild.voiceAdapterCreator,
        channelId: voiceMember.channelId,
        guildId: String(voiceMember.guild.id),
      });

      const source = this.getSourceStream();

      const queue = this.getQueue();

      const video = await source.getStreamFromUrl(input);

      const searchResult =
        video ?? ((await source.search(input)) as Array<StreamInfo>);

      searchResult.forEach((streamInfo: StreamInfo) => {
        queue.add(voiceMember.channelId, {
          streamInfo: {
            title: streamInfo.title,
            url: streamInfo.url,
            artist: streamInfo.artist,
          },
          userSearch: input,
        });
      });

      const player = this.getPlayer(voiceMember.channelId);
      connection.subscribe(player);

      let replyContent = `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${searchResult[0].title}`;

      if (player.state.status === AudioPlayerStatus.Idle) {
        let url = searchResult[0].url;
        if (!searchResult[0]?.url) {
          const search = (await this.getSourceStream().search(
            `${searchResult[0].title} ${searchResult[0].artist}`,
            {
              limit: 1,
            }
          )) as ResultAudioSearch;

          url = search.url;
        }

        player.play(await this.getAudioResource(url));

        const playHook = new PlayHook(this.bot);

        playHook.execute(message);

        replyContent = `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${searchResult[0].title}`;
      }

      await message.channel.send(replyContent);
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
