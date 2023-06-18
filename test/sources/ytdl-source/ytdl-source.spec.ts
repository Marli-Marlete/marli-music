import { describe, expect, it, vi, beforeAll, afterAll, beforeEach, afterEach} from 'vitest';
import { Readable } from 'stream';
import { ERRORS } from '../../../src/shared/errors';
import { mockVideoUrl, setupYtdlStub } from './ytdl-mocks';

import { YtdlSourceStream } from '../../../src/sources/ytdl-source/ytdl-source';



describe('src/sources/ytdl-source/ytdl-source-stream.ts', () => {
	
    beforeAll(() => {
        setupYtdlStub
    })

    afterAll(() => {
		vi.resetAllMocks();
		vi.clearAllMocks();
        vi.restoreAllMocks
	});


	describe('getStream()', () => {
    
		it('should run getStream correctly', async () => {
			const ytdlSource = new YtdlSourceStream();
			const stream = await ytdlSource.getStream(mockVideoUrl);
			expect(stream).toBeDefined();
			expect(stream).toEqual(new Readable());
		});
		it('shoud return RESULT_NOT_FOUND on invalid yt url passed', async () => {
			const ytdlSource = new YtdlSourceStream();

			await ytdlSource.getStream('invalid_url').catch((e) => {
				expect(e).toEqual(ERRORS.RESULT_NOT_FOUND);
			});
		});
	});

	describe('getStreamFromUrl()', () => {

		it('should return youtube video results', async () => {
			const ytdlSource = new YtdlSourceStream();
			const results = await ytdlSource.search('test');
			expect(results).toBeDefined();
		});

		it('should return RESLT_NOT_FOUND when no results were available', async () => {
			const ytdlSource = new YtdlSourceStream();
			ytdlSource.search('___').catch((reason) => {
				expect(reason).toEqual(ERRORS.RESULT_NOT_FOUND);
			});
		});
	});

	describe('search()', () => {

        
		it('should run getStreamFromUrl() ', async () => {
        
			const source = new YtdlSourceStream();
			const results = await source.getStreamFromUrl(mockVideoUrl);
			expect(results).toBeDefined();
		});

		it('should return undefined due to invalid url', async () => {
			
			const source = new YtdlSourceStream();
			await source
				.getStreamFromUrl('www.invalid-yt-url')
				.catch((reason) => expect(reason).toEqual(ERRORS.RESULT_NOT_FOUND));
		});
	});
});
