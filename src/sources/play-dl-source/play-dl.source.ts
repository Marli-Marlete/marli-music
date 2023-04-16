import { Readable } from 'node:stream';
import play, { YouTubeVideo } from 'play-dl';

import { ERRORS } from '../../shared/errors';
import { ResultAudioSearch, SourceStream } from '../source-stream';

export class PlayDlSourceStream implements SourceStream {
	async getStream(url: string): Promise<Readable> {
		try {
			const result = await play.stream(url, {});
			return result.stream;
		} catch (e) {
			console.debug(e);
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}
	async search(input: string): Promise<ResultAudioSearch[]> {
		try {
			const result = await play.search(input, {
				source: {
					youtube: 'video',
				},
			});

			return result.map((video: YouTubeVideo) => ({
				duration: video.durationRaw.toString(),
				id: video.id,
				title: video.title,
				url: video.url,
			}));
		} catch (e) {
			console.debug(e);
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}
}
