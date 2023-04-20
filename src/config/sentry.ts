import * as Sentry from '@sentry/node';

export function initSentry() {
	Sentry.init({
		dsn: process.env.SENTRY_DNS,
		tracesSampleRate: 1.0,
	});
}

export function sentryCapture(name: string, error: Error) {
	const transaction = Sentry.startTransaction({
		op: 'transaction',
		name,
	});

	Sentry.captureException(error);
	transaction.finish();
}
