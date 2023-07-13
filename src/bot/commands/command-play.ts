import { Message } from 'discord.js';

import {
  AudioPlayerStatus,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';

import { StreamInfo } from '../../sources/source-stream';
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
      const source = this.getSourceStream();

      const videos = await source.getStreamFromUrl(input);
      let searchResult = videos ?? (await source.search(input));

      const streamInfo: StreamInfo[] = searchResult.map((video) => ({
        title: video?.title,
        url: video?.url,
      }));

      console.log({ streamInfo });

      const stream = await source.getStream(streamInfo[0]?.url);

      const audioResource = createAudioResource(stream, {
        inputType: StreamType.Opus,
      });

      const voiceMember = message.member.voice;

      const connection = joinVoiceChannel({
        adapterCreator: voiceMember.guild.voiceAdapterCreator,
        channelId: voiceMember.channelId,
        guildId: String(voiceMember.guild.id),
      });

      const player = this.getPlayer(voiceMember.channelId);

      connection.subscribe(player);

      const queue = this.getQueue();

      if (videos[0].artist) {
        console.log('ARTIST: ', `${videos[0].title} - ${videos[0].artist}`);
        searchResult = await source.search(
          `${videos[0].title} - ${videos[0].artist}`,
          {
            limit: 1,
          }
        );

        await Promise.all(
          videos.map(async (currentStream) => {
            console.log('QUEUE: ', currentStream.artist);
            queue.add(voiceMember.channelId, {
              audioResource,
              streamInfo: currentStream,
            });

            await message.reply({
              content: `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${currentStream.title}`,
            });
          })
        );
      }

      if (player.state.status === AudioPlayerStatus.Idle) {
        player.play(audioResource);

        const playHook = new PlayHook(this.bot);

        playHook.execute(message);

        await message.reply({
          content: `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${streamInfo[0].title}`,
        });
      } else {
        queue.add(voiceMember.channelId, {
          audioResource,
          streamInfo: streamInfo[0],
        });

        await message.reply({
          content: `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${streamInfo[0].title}`,
        });
      }
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
