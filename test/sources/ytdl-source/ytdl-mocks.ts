import { Readable } from 'stream';
import { vi } from 'vitest';
import yts from 'yt-search';
import ytdl from 'ytdl-core';

export const mockVideoUrl = 'https://www.youtube.com/watch?v=qGl7b1EPwfA';

export const mockVideoResult: yts.VideoSearchResult = {
	videoId: 'qGl7b1EPwfA',
	title: 'video test 1',
	seconds: 40,
	url: 'www.youtube.com/watch?=023912',
	duration: {
		seconds: 40,
		toString: () => '40',
		timestamp: '',
	},
} as yts.VideoSearchResult;

export const mockYtVideoInfo = {
	player_response: {
		videoDetails: {
			title: mockVideoResult.title,
			videoId: 'qGl7b1EPwfA',
		},
	},
	videoDetails: {
		video_url: mockVideoUrl,
	},
};

export const mockSearchResult: Partial<yts.SearchResult> = {
	videos: [mockVideoResult],
};

export function setupYtdlStub() {
	vi.mock('ytdl-core', async () => {
		const original = await vi.importActual<typeof import('ytdl-core')>(
			'ytdl-core',
		);
		const ytdlMock = {
			...original,
			default: (url: string) => {
				return url === mockVideoUrl ? new Readable() : null;
			},
			validateURL: (url: string) => url.includes('www.youtube.com/watch?v='),
			getURLVideoID: () => mockVideoUrl,
			getInfo: () => mockYtVideoInfo,
		};

		return ytdlMock;
	});

	vi.mock('yt-search', async () => {
		return {
			default: (query: string) => {
				if (query === 'test') return Promise.resolve(mockSearchResult);
				return { videos: [] };
			},
		};
	});
}
