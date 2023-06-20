import supertest from 'supertest';
import {
	afterAll,
	afterEach,
	describe,
	expect,
	it,
	SpyInstance,
	vi,
} from 'vitest';

import { logger } from '../../src/config/winston';
import { appServer, httpServer, startServer } from '../../src/http/index';

describe('src/http/index.ts', () => {
	afterEach(() => {
		httpServer.close();
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	it('should start express server', async () => {
		const spyUse = vi.spyOn(appServer, 'use');
		const spyListen: SpyInstance = vi.spyOn(appServer, 'listen');

		startServer();

		expect(spyListen).toHaveBeenCalledOnce();
		expect(spyUse).toHaveBeenCalledOnce();
	});

	it('should log `server listening`', () => {
		const logSpy = vi.spyOn(logger, 'log');

		startServer();
		setTimeout(() => {
			expect(logSpy).toHaveBeenCalledOnce();
		}, 500);
	});

	it('should reach route [GET] / ', async () => {
		startServer();
		const response = await supertest(appServer).get('/');
		expect(response.status).toBe(200);
	});
});
