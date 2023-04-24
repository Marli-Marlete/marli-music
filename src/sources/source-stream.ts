import { StreamType, createAudioResource } from '@discordjs/voice';
import { logger } from 'config/winston';
import { Readable } from 'node:stream';
import { ERRORS } from 'shared/errors';
import { SearchResult } from 'yt-search';

export interface Queue {
	items: number;
}

export interface ResultAudioSearch {
	title: string;
	duration: string;
	id: string;
	url: string;
}

export interface StreamInfo {
	url: string;
	title: string;
}

export interface SourceStream {
	getStream(url: string): Readable | Promise<Readable>;
	search(input: string): ResultAudioSearch[] | Promise<ResultAudioSearch[]>;
	getStreamInfo(input: string): Promise<StreamInfo>;
}

export async function makeAudioResource(
	sourceStream: SourceStream,
	data: StreamInfo,
) {
	try {
		const stream = await sourceStream.getStream(data['url'] ?? data[0].url);

		const resource = createAudioResource(stream, {
			inputType: StreamType.Arbitrary,
		});

		if (!resource.readable) throw new Error(ERRORS.RESOURCE_ERROR);

		return resource;
	} catch (err) {
		logger.log('error', err);
	}
}
