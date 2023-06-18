import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import * as dotenv from 'dotenv';
import { initSentry } from '../../src/config/sentry';
import { initConfigs } from '../../src/config/index';

describe('src/config/index.ts', () => {
	beforeAll(() => {
		vi.mock('dotenv');
		vi.mock('../../src/config/sentry');
	});

	afterAll(() => {
		vi.clearAllMocks();
	});

	it('should run initConfigs correctly', () => {
		initConfigs();
		expect(dotenv.config).toHaveBeenCalledOnce();
		expect(initSentry).toHaveBeenCalledOnce();
	});
});
