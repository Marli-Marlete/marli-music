import { AudioResource } from '@discordjs/voice';
import { logger } from 'config/winston';
import { StreamInfo } from 'sources/source-stream';

export interface QueueData {
	streamInfo: StreamInfo;
	audioResource: AudioResource;
}

export abstract class Queue {
	items: Map<string, QueueData[]> = new Map();

	constructor() {
		this.items = new Map();
	}

	abstract getList(_connection: string): QueueData[];

	abstract add(connection: string, value: QueueData): void;

	abstract pop(connection: string): void;
}

export class LocalQueue extends Queue {
	constructor() {
		super();
	}

	getList(_connection: string): QueueData[] {
		logger.log('debug', JSON.stringify(this.items));
		return this.items.get(_connection);
	}

	add(connection: string, value: QueueData) {
		const connectionItems = this.items.get(connection);
		console.log('ADDING TO QUEUE', connectionItems);
		if (!connectionItems) {
			this.items.set(connection, [value]);
		} else {
			connectionItems.push(value);
		}
		console.log('ADDING TO QUEUE', this.items.get(connection));
	}

	pop(connection: string) {
		const connectionItems = this.items.get('connection');
		connectionItems.shift();
		this.items.set(connection, connectionItems);
		console.log('POPPING TO QUEUE', this.items);
	}
}
