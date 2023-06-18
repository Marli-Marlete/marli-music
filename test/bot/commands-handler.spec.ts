import { YtdlSourceStream } from './../../src/sources/ytdl-source/ytdl-source';
import { CommandsHandler } from './../../src/bot/commands-handler';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { VoiceConnection } from '@discordjs/voice';

describe('src/bot/commands-handler.ts', () => {

	const mockedMessage = {
		author: "test",
		member: {
			voice: "voice"
		},
		reply: (props: {content: string}) => {}
	} 

	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('CommandsHandler', () => {
		describe('search', () => {
			it('should call validateInput', () => {

				const handler = new CommandsHandler(new YtdlSourceStream())
				const searchSpy = vi.spyOn(handler, 'search');
				handler.search({} as any, 'test');
				expect(searchSpy).toHaveBeenCalledWith({}, 'test');
			})
		})

		describe('play', () => {
			it('should return false', () => {

				const handler = new CommandsHandler(new YtdlSourceStream())
				const playSpy = vi.spyOn(handler, 'play');
				handler.play(mockedMessage as any, '');
				expect(playSpy).toHaveBeenCalledWith(mockedMessage as any, '');
			})
		})

		describe('pause', () => {
			it('should call pause', () => {	

				const handler = new CommandsHandler(new YtdlSourceStream())
				handler.getPlayer()
				
				vi.spyOn(handler, 'getConnection').mockImplementationOnce(() => ({}) as VoiceConnection)

				const pauseSpy = vi.spyOn(handler, 'pause');
				handler.pause(mockedMessage as any);
				expect(pauseSpy).toHaveBeenCalledOnce()
			})
		})

		describe('resume', () => {
			it('should call resume', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				handler.getPlayer()
				
				vi.spyOn(handler, 'getConnection').mockImplementationOnce(() => ({}) as VoiceConnection)

				const resumeSpy = vi.spyOn(handler, 'resume');
				handler.resume(mockedMessage as any);
				expect(resumeSpy).toHaveBeenCalledOnce()
			})

		})

		describe('stop', () => {
			it('should call stop', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				handler.getPlayer()

				const stopSpy = vi.spyOn(handler, 'stop');
				handler.stop(mockedMessage as any);
				expect(stopSpy).toHaveBeenCalledOnce()
			})
		})

		describe('validateInput', () => {
			it('should throw error if input is empty', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				expect(() => handler.validateInput({} as any, '')).toThrowError()
			})

			it('should return true', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				expect(handler.validateInput({} as any, 'test')).toBeTruthy()
			})
		})

		describe('getPlayer', () => {
			it('should return player', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				expect(handler.getPlayer()).toBeTruthy()
			})
		})

		describe('setSourceStream', () => {
			it('Should set source', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				handler.setSourceStream(new YtdlSourceStream())
				expect(handler.getSourceStream()).toBeTruthy()
			})
		})

		describe('getConnection', () => {
			it('should return connection', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				handler.getPlayer()
				
				//should mock discord function not this one
				vi.spyOn(handler, 'getConnection').mockImplementationOnce(() => ({}) as VoiceConnection)

				expect(handler.getConnection(mockedMessage as any)).toBeTruthy()
			})
		})

		describe('validateInput', () => {
			it('should return true', () => {
				const handler = new CommandsHandler(new YtdlSourceStream())
				expect(handler.validateInput({} as any, 'test')).toBeTruthy()
			})
		})

	})


});
