import { MarliMusic } from 'bot/marli-music';
import { SourceStream } from './../../sources/source-stream';
import { Message } from 'discord.js';
import { StreamInfo } from 'sources/source-stream';
import { Queue } from 'queue/queue';
import {
	AudioPlayerStatus,
	StreamType,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import { ERRORS } from 'shared/errors';
import { sendCommandError } from '../containts/default-messages';
import { Command } from './command';
import { BotHooks } from 'bot/hooks/boot-hooks';

export class Play extends Command {
	constructor(private source: SourceStream, private queue: Queue) {
		super();
		this.name = 'play';
	}
	async execute(bot: MarliMusic, message: Message, input: string) {
		try {
			this.player = bot.getPlayer(message.channelId);
			const video = await this.source.getStreamFromUrl(input);
			const searchResult = video ?? (await this.source.search(input));

			const streamInfo: StreamInfo = {
				title: video?.title || searchResult[0].title,
				url: video?.url || searchResult[0].url,
			};

			const stream = await this.source.getStream(
				video?.url ?? searchResult[0].url,
			);

			const resource = createAudioResource(stream, {
				inputType: StreamType.Opus,
			});

			if (!resource.readable) throw new Error(ERRORS.RESOURCE_ERROR);

			const voiceMember = message.member.voice;

			const connection = joinVoiceChannel({
				adapterCreator: voiceMember.guild.voiceAdapterCreator,
				channelId: voiceMember.channelId,
				guildId: String(voiceMember.guild.id),
			});

			connection.subscribe(this.player);

			if (this.player.state.status === AudioPlayerStatus.Idle) {
				this.player.play(resource);
				const hooks = new BotHooks(
					message,
					connection,
					this.player,
					this.queue,
				);
				hooks.startHooks();
			} else {
				this.queue.add(voiceMember.channelId, {
					audioResource: resource,
					streamInfo,
				});
			}
		} catch (err) {
			sendCommandError(err, err.message);
		}
	}
}
