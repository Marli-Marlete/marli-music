import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { startServer } from '../src/http';
import { initConfigs } from '../src/config';
import { botStartup } from '../src/bot';

describe('src/index.ts', () => {
	beforeAll(() => {
		vi.mock('../src/http/index');
		vi.mock('../src/config/index');
		vi.mock('../src/bot/index');
	});

	afterAll(() => {
		vi.clearAllMocks();

		it('should have called', () => {
			expect(startServer()).toBeCalled();
		});
	});

	it('should run correctly all functions', () => {
		initConfigs();
		startServer();
		botStartup();

		expect(initConfigs).toHaveBeenCalled();
		expect(startServer).toHaveBeenCalled();
		expect(startServer).toHaveBeenCalled();
	});
});
