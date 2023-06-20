import { Readable } from 'stream';
import { afterAll, describe, expect, it, vi } from 'vitest';

import {
	ResultAudioSearch,
	SourceStream,
	StreamInfo,
} from '../../src/sources/source-stream';

describe('src/sources/source-stream.ts', () => {
	const mockURLStream = 'https://some.stream.io?stream=03310';
	const mockResultAudio: ResultAudioSearch = {
		duration: '1:40',
		id: '1',
		title: 'some-stream-audio',
		url: mockURLStream,
	};

	const mockStreamInfo: StreamInfo = {
		title: 'some-stream',
		url: mockURLStream,
	};

	class TestSourceStream implements SourceStream {
		getStream(_url: string): Readable | Promise<Readable> {
			console.log(_url);
			const readable = new Readable({
				encoding: 'utf-8',
			});
			return readable;
		}

		getStreamInfo(_input: string): Promise<StreamInfo> {
			console.log(_input);
			return Promise.resolve(mockStreamInfo);
		}

		search(_input: string): ResultAudioSearch[] | Promise<ResultAudioSearch[]> {
			console.log(_input);
			return [mockResultAudio];
		}

		getStreamFromUrl(_url: string): Promise<StreamInfo> {
			console.log(_url);
			return Promise.resolve(mockStreamInfo);
		}

		validate(_input: string): Promise<boolean> {
			console.log(_input);

			return Promise.resolve(true);
		}
	}

	afterAll(() => {
		vi.clearAllMocks();
	});

	it('should have correct instance of SourceStream', () => {
		const testStream = new TestSourceStream();
		expect(testStream.getStream).toBeDefined();
		expect(testStream.search).toBeDefined();
		expect(testStream.getStreamInfo).toBeDefined();
	});

	it('should run search correctly', () => {
		vi.spyOn(TestSourceStream.prototype, 'search');

		const testStream = new TestSourceStream();
		const result = testStream.search('test');

		expect(TestSourceStream.prototype.search).toHaveBeenCalledOnce();
		expect(TestSourceStream.prototype.search).toBeCalledWith('test');
		expect(result).toEqual([mockResultAudio]);
	});
	it('should run getStreamInfo correctly', async () => {
		vi.spyOn(TestSourceStream.prototype, 'getStreamInfo');

		const testStream = new TestSourceStream();
		const result = await testStream.getStreamInfo('test');

		expect(TestSourceStream.prototype.getStreamInfo).toHaveBeenCalledOnce();
		expect(TestSourceStream.prototype.getStreamInfo).toBeCalledWith('test');
		expect(result).toEqual(mockStreamInfo);
	});
	it('should run getStream correctly', async () => {
		vi.spyOn(TestSourceStream.prototype, 'getStream');

		const readableStream = new Readable({ encoding: 'utf-8' });

		const testStream = new TestSourceStream();
		const result = await testStream.getStream('test');

		expect(TestSourceStream.prototype.getStream).toHaveBeenCalledOnce();
		expect(TestSourceStream.prototype.getStream).toBeCalledWith('test');
		expect(result).toEqual(readableStream);
	});
});
