import { AudioPlayer, JoinConfig, VoiceConnection } from '@discordjs/voice';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { BotHook } from '../../src/bot/bot-hooks'

describe('src/bot/bot-hooks.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('startBotHooks()', () => {	
		it('should run startBotHooks correctly', () => {
			const joinConfig: JoinConfig = {
				channelId: '123',
				group: "123",
				guildId: '123',
				selfDeaf: true,
				selfMute: false
			}
			const connection : VoiceConnection = new VoiceConnection(joinConfig, {
				adapterCreator : () => {}
			} as any) 
			const player = new AudioPlayer()

			const hook = new BotHook(connection, player);
			const spyBotHookStart = vi.spyOn(hook, 'startBotHooks')
			hook.startBotHooks()

			expect(spyBotHookStart).toHaveBeenCalled()
			
		});
	})

});
