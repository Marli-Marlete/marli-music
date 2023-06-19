import { afterAll, describe, expect, it, vi } from 'vitest';
import Sentry, { Transaction } from '@sentry/node';
import { initSentry, sentryCapture } from '../../src/config/sentry';

describe('src/config/sentry.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	it('should run initSentry', () => {
		vi.spyOn(Sentry, 'init').mockResolvedValueOnce();

		const sentryDns = 'http://sentry-test.com?id=9213812';
		process.env.SENTRY_DNS = sentryDns;
		initSentry();
		expect(Sentry.init).toHaveBeenCalledOnce();
		expect(Sentry.init).toHaveBeenCalledWith({
			dsn: sentryDns,
			environment: 'test',
			tracesSampleRate: 1.0,
		});
	});

	it('should run SentryCapture correctly', () => {
		const name = 'TEST_ERROR';
		const testError = new Error('Test Exception has happened');

		const startTransactionSpy = vi
			.spyOn(Sentry, 'startTransaction')
			.mockImplementationOnce(() => {
				return {
					finish(endTimestamp) {
						return endTimestamp;
					},
				} as Transaction;
			});

		vi.spyOn(Sentry, 'captureException').mockImplementation(() => '');

		sentryCapture(name, testError);

		expect(startTransactionSpy).toHaveBeenCalledOnce();
		expect(Sentry.captureException).toHaveBeenCalledOnce();
		expect(Sentry.captureException).toHaveBeenLastCalledWith(testError);
	});
});
