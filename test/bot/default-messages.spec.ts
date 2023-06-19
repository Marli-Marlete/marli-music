import { afterAll, describe, expect, it, vi } from 'vitest';
import { BOT_MESSAGES } from '../../src/bot/containts/default-messages';

describe('src/bot/default-messages.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('BOT_MESSAGES', () => {
		it('should return BOT_MESSAGES', () => {
			const msg = BOT_MESSAGES.INVALID_COMMAND;
			expect(msg).toBeDefined();
		});
	});
});
