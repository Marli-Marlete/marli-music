import { FakeCache } from 'cache/cache';
import { logger } from 'config/winston';
import { StreamInfo } from 'sources/source-stream';

export class Queue {
	constructor(private cache: FakeCache) {
		this.data = {
			key: '',
			list: [],
		};
	}

	data: {
		key: string;
		list: StreamInfo[];
	};

	getList(_connection: string): StreamInfo[] {
		// this.cache.get();
		logger.log('debug', JSON.stringify(this.data.list));
		return this.data.list;
	}

	add(_connection: string, value: StreamInfo) {
		this.data.list.push(value);
		console.log('QUEUE', this.data.list);
	}

	pop() {
		this.data.list.shift();
	}
}

const cache = new FakeCache();
export const queue: Queue = new Queue(cache);
