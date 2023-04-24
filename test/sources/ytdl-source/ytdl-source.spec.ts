import { afterAll, describe, expect, it, vi } from 'vitest';
import { Readable } from 'stream';
import { ERRORS } from '../../../src/shared/errors';
import { mockSearchResult, mockVideoResult, mockVideoUrl } from './ytdl-mocks';

vi.mock('ytdl-core', async () => {
	const original = await vi.importActual<typeof import('ytdl-core')>(
		'ytdl-core',
	);
	return {
		...original,
		default: (url: string) => {
			if (original.validateURL(url)) return Promise.resolve(new Readable());
			else return null;
		},
		validateURL: (url: string) => original.validateURL(url),
		getURLVideoID: () => mockVideoUrl,

		getInfo: () => {
			return {
				player_response: {
					videoDetails: {
						title: mockVideoResult.title,
					},
				},
				videoDetails: {
					video_url: mockVideoResult.url,
				},
			};
		},
	};
});

vi.mock('yt-search', async () => {
	return {
		default: (query: string) => {
			if (query === 'test') return Promise.resolve(mockSearchResult);
			return { videos: [] };
		},
	};
});

import { YtdlSourceStream } from '../../../src/sources/ytdl-source/ytdl-source';

describe('src/sources/ytdl-source/ytdl-source-stream.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('getStream()', () => {
		it('should run getStream correctly', async () => {
			const ytdlSource = new YtdlSourceStream();
			const stream = await ytdlSource.getStream(mockVideoUrl);
			expect(stream).toBeDefined();
			expect(stream).toEqual(new Readable());
		});
		it('shoud get RESULT_NOT_FOUND on invalid yt url passed', async () => {
			const ytdlSource = new YtdlSourceStream();

			await ytdlSource.getStream('test').catch((e) => {
				expect(e).toEqual(ERRORS.RESULT_NOT_FOUND);
			});
		});
	});
	describe('search()', () => {
		it('should return youtube video results', async () => {
			const ytdlSource = new YtdlSourceStream();
			const results = await ytdlSource.search('test');
			expect(results).toBeDefined();
		});
	});
	describe('getStreamInfo()', async () => {});
});
