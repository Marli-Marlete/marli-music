import { Readable } from 'node:stream';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

import { ERRORS } from '../../shared/errors';
import { ResultAudioSearch, SourceStream } from '../source-stream';

export class YtdlSourceStream implements SourceStream {
	getStream(url: string): Readable {
		try {
			console.log(url);
			const stream = ytdl(url, {
				filter: 'audioonly',
				quality: 'highestaudio',
			});
			if (stream) return stream;
		} catch (e) {
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}

	async search(input: string): Promise<ResultAudioSearch[]> {
		try {
			const result = await yts(input);
			if (result.videos.length < 1) throw new Error(ERRORS.RESULT_NOT_FOUND);
			const videos = result.videos.slice(0, 10);
			return videos.map((video) => {
				return {
					duration: video.duration.toString(),
					id: video.videoId,
					title: video.title,
					url: video.url,
				};
			});
		} catch (e) {
			console.error(e);
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}

	async getStreamInfo(input: string) {
		try {
			if (input.startsWith('https') && ytdl.validateURL(input)) {
				const videoId = ytdl.getURLVideoID(input);

				const info = await ytdl.getInfo(videoId);

				return {
					title: info.player_response.videoDetails.title,
					url: info.videoDetails.video_url,
				};
			}
		} catch (e) {
			console.debug(e);
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}
}
