import { Message } from 'discord.js';

import { createEmbedMessage } from '@/helpers/helpers';
import { StreamInfo } from '@/sources/source-stream';
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

      const searchedStream = await source.getStreamFromUrl(input);

      const streamInfoCollection =
        searchedStream ??
        ((await source.search(input, { limit: 1 })) as StreamInfo[]);

      streamInfoCollection.forEach((streamInfo: StreamInfo) => {
        queue.add(voiceMember.channelId, {
          streamInfo,
          userSearch: input,
        });
      });

      const firstSong = streamInfoCollection.shift();

      const player = this.getPlayer(voiceMember.channelId);
      connection.subscribe(player);

      let replyContent = `${BOT_MESSAGES.PUSHED_TO_QUEUE}`;

      if (player.state.status === AudioPlayerStatus.Idle) {
        const searchResultUrl =
          firstSong?.url ??
          (await this.getResourceUrl(firstSong.title, firstSong.artist));

        player.play(await this.getAudioResource(searchResultUrl));

        const playHook = new PlayHook(this.bot);

        playHook.execute(message);

        replyContent = `${BOT_MESSAGES.CURRENT_PLAYING}`;
      }

      const embedMessage = createEmbedMessage({
        url: firstSong?.source?.url ?? firstSong.url,
        author: {
          name: firstSong.artist,
          url: firstSong.url,
          icon_url: firstSong?.thumbnail?.url,
        },
        title: firstSong.title,
        footer: {
          text: message.author.username,
        },
        thumbnail: {
          url: firstSong?.thumbnail?.url,
        },
      });

      await message.channel.send({
        content: replyContent,
        embeds: [embedMessage],
      });
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
