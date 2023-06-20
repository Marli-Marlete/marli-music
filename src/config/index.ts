import * as dotenv from 'dotenv';

import { initSentry } from './sentry';

export function initConfigs() {
	dotenv.config();
	initSentry();
}
