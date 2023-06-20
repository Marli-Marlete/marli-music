import * as Sentry from '@sentry/node';

export function initSentry() {
	Sentry.init({
		dsn: process.env.SENTRY_DNS,
		environment: process.env.NODE_ENV || 'development',
		tracesSampleRate: 1.0,
	});
}

export function sentryCapture(name: string, error: Error) {
	const transaction = Sentry.startTransaction({
		name,
		op: 'transaction',
	});

	Sentry.captureException(error);
	transaction.finish();
}
