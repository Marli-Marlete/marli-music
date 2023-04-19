import { Readable } from 'node:stream';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

import { ERRORS } from '../../shared/errors';
import { ResultAudioSearch, SourceStream } from '../source-stream';

export class YtdlSourceStream implements SourceStream {
	async getStream(url: string): Promise<Readable> {
		const stream = ytdl(url, {
			filter: 'audioonly',
			quality: 'lowestaudio',
			dlChunkSize: 0,
			highWaterMark: 1 << 25,
		});
		if (!stream) Promise.reject(ERRORS.RESULT_NOT_FOUND);
		return Promise.resolve(stream);
	}

	async search(input: string): Promise<ResultAudioSearch[]> {
		const result = await yts(input);
		if (result.videos.length < 1)
			return Promise.reject(ERRORS.RESULT_NOT_FOUND);
		const videos = result.videos.slice(0, 10);
		return videos.map((video) => ({
			duration: video.duration.toString(),
			id: video.videoId,
			title: video.title,
			url: video.url,
		}));
	}

	async getStreamInfo(input: string) {
		if (input.startsWith('https') && ytdl.validateURL(input)) {
			const videoId = ytdl.getURLVideoID(input);

			const info = await ytdl.getInfo(videoId);

			return {
				title: info.player_response.videoDetails.title,
				url: info.videoDetails.video_url,
			};
		}
	}
}
