import { Message } from 'discord.js';
import {
  AudioPlayerStatus,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from '@discordjs/voice';

import { StreamInfo } from '../../sources/source-stream';
import { BOT_MESSAGES } from '../containts/default-messages';
import { PlayHook } from './hooks/command-play-hook';
import { MarliMusic } from '../marli-music';
import { Command } from './command';

export class Play extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
    this.name = 'play';
  }
  async execute(message: Message, input: string) {
    try {
      await this.validate(message, input);
      const source = this.getSourceStream();

      const video = await source.getStreamFromUrl(input);
      const searchResult = video ?? (await source.search(input));

      const streamInfo: StreamInfo = {
        title: video?.title || searchResult[0].title,
        url: video?.url || searchResult[0].url,
      };

      const stream = await source.getStream(video?.url ?? searchResult[0].url);

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

      if (player.state.status === AudioPlayerStatus.Idle) {
        player.play(audioResource);
        const playHook = new PlayHook(this.bot);
        playHook.execute(message);
        await message.reply({
          content: `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${streamInfo.title}`,
        });
      } else {
        queue.add(voiceMember.channelId, {
          audioResource,
          streamInfo,
        });
        await message.reply({
          content: `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${streamInfo.title}`,
        });
      }
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
