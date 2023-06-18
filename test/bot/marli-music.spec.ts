import { afterAll, describe, expect, it, vi } from 'vitest';
import { MarliMusic } from '../../src/bot/marli-music';
import { CommandsHandler } from '../../src/bot/commands-handler';
import { YtdlSourceStream } from '../../src/sources/ytdl-source/ytdl-source';

describe('src/bot/marli-music.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('healthCheck', () => {
		it('should return healthCheck', () => {

			const handler = new CommandsHandler(new YtdlSourceStream())
			vi.spyOn(MarliMusic.prototype, 'login').mockImplementation(() => Promise.resolve(""));
			const marli = new MarliMusic({
				prefix: '!',
				token: '123'
			}, handler, {
				intents: []
			})

			const healthCheckSpy = vi.spyOn(marli, 'healthCheck');

			expect(healthCheckSpy).toBeDefined();
		})
	})
});
