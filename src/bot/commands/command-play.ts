import { Message } from 'discord.js';
import {
	AudioPlayerStatus,
	StreamType,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';

import { MarliMusic } from '../marli-music';
import { StreamInfo } from '../../sources/source-stream';
import { ERRORS } from '../../shared/errors';
import { BOT_MESSAGES, sendCommandError } from '../containts/default-messages';
import { Command } from './command';
import { BotHooks } from '../hooks/boot-hooks';

export class Play extends Command {
	constructor(bot: MarliMusic) {
		super(bot);
		this.name = 'play';
	}
	async execute(message: Message, input: string) {
		this.validate(message, input);

		try {
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

			if (!audioResource.readable) throw new Error(ERRORS.RESOURCE_ERROR);

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
				const hooks = new BotHooks(message, connection, player, queue);
				hooks.startHooks();
				message.reply({
					content: `${message.author.username} ${BOT_MESSAGES.CURRENT_PLAYING} ${streamInfo.title}`,
				});
			} else {
				queue.add(voiceMember.channelId, {
					audioResource,
					streamInfo,
				});
				message.reply({
					content: `${message.author.username} ${BOT_MESSAGES.PUSHED_TO_QUEUE} ${streamInfo.title}`,
				});
			}
		} catch (err) {
			sendCommandError(err, err.message);
		}
	}
}
