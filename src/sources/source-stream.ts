import { Readable } from 'node:stream';

export interface Queue {
	items: number;
}

export interface ResultAudioSearch {
	title: string;
	duration: string;
	id: string;
	url: string;
}

export interface SourceStream {
	getStream(url: string): Readable | Promise<Readable>;
	search(input: string): ResultAudioSearch[] | Promise<ResultAudioSearch[]>;
}