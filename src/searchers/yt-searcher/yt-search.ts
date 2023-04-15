import { ResultAudioSearch, Searcher } from 'searchers/searcher';
import { ERRORS } from 'shared/errors';
import yts from 'yt-search';

export class YtSearch implements Searcher {
	async search(input: string): Promise<ResultAudioSearch[]> {
		try {
			const result = await yts(input);
			const videos = result.videos.slice(0, 10);
			return videos.map((video) => {
				return {
					id: video.videoId,
					title: video.title,
					duration: video.duration.toString(),
				};
			});
		} catch (e) {
			console.error(e);
			throw new Error(ERRORS.RESULT_NOT_FOUND);
		}
	}
}
