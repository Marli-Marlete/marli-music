import { AudioResource } from '@discordjs/voice';
import { StreamInfo } from 'sources/source-stream';
import { shuffleArray } from '../helpers/helpers';

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

  abstract shuffle(connection: string): void;
}

export class LocalQueue extends Queue {
  constructor() {
    super();
  }

  getList(connectionID: string): QueueData[] {
    return this.items.get(connectionID) || [];
  }

  add(connectionID: string, value: QueueData) {
    const connectionItems = this.getList(connectionID);
    connectionItems.push(value);
    this.items.set(connectionID, connectionItems);
  }

  pop(connectionID: string) {
    const connectionItems = this.getList(connectionID);
    connectionItems.shift();
    this.items.set(connectionID, connectionItems);
  }

  clear(connectionID: string): void {
    this.items.delete(connectionID);
  }

  shuffle(connectionID: string): void {
    const list = this.getList(connectionID);

    const shuffledList = shuffleArray<QueueData>(list);

    this.items.set(connectionID, shuffledList);
  }
}
