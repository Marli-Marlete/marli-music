import { StreamInfo } from 'sources/source-stream'

import { AudioResource } from '@discordjs/voice'

export interface QueueData {
	streamInfo: StreamInfo;
	audioResource: AudioResource;
}

export abstract class Queue {
  items: Map<string, QueueData[]> = new Map();

	abstract getList(connection: string): QueueData[];

	abstract add(connection: string, value: QueueData): void;

	abstract pop(connection: string): void;

	abstract clear(connection: string): void;
}

export class LocalQueue extends Queue {
  constructor() {
    super();
  }

  getList(connectionID: string): QueueData[] {
    return this.items.get(connectionID);
  }

  add(connectionID: string, value: QueueData) {
    const connectionItems = this.getList(connectionID);

    if (!connectionItems) {
      this.items.set(connectionID, [value]);
    } else {
      connectionItems.push(value);
    }
  }

  pop(connectionID: string) {
    const connectionItems = this.getList(connectionID);
    connectionItems.shift();
    this.items.set(connectionID, connectionItems);
  }

  clear(connectionID: string): void {
    const connectionItems = this.getList(connectionID);
    if (connectionItems) {
      this.items.set(connectionID, []);
    }
  }
}
