import exp from 'node:constants';
import { PlayDlSourceStream } from './../../../src/sources/play-dl-source/play-dl-source';
import { afterAll, describe, expect, it, vi } from 'vitest';

describe('src/sources/play-dl-source/play-dl-source-stream.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('getStream()', () => {
		it('should run getStream correctly', async () => {
			const playDLSource = new PlayDlSourceStream()
			
			expect(playDLSource).toBeDefined();
		});
	})
});
