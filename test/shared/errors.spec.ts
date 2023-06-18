import { describe, expect, it } from 'vitest';
import { ERRORS } from '../../src/shared/errors';

describe('src/shared/errors.ts', () => {
	it('should contain correct errors', () => {
		const errors = Object.values(ERRORS).map((msg) => new Error(msg));

		errors.forEach((error) => expect(ERRORS[error.message]).toBeDefined);
	});
});
