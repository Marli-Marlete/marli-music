import { Message } from 'discord.js';

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

      let replyContent = `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${firstSong.title} - ${firstSong.artist}`;

      if (player.state.status === AudioPlayerStatus.Idle) {
        const searchResultUrl =
          firstSong?.url ??
          (await this.getResourceUrl(firstSong.title, firstSong.artist));

        player.play(await this.getAudioResource(searchResultUrl));

        const playHook = new PlayHook(this.bot);

        playHook.execute(message);

        replyContent = `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${firstSong.title} - ${firstSong.artist}`;
      }

      await message.channel.send(replyContent);
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
