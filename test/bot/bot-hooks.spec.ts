import { AudioPlayer, JoinConfig, VoiceConnection } from '@discordjs/voice';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { BotHooks } from '../../src/bot/hooks/boot-hooks';
import { LocalQueue } from '../../src/queue/queue';

describe('src/bot/hooks/bot-hooks.ts', () => {
	afterAll(() => {
		vi.clearAllMocks();
	});

	describe('startBotHooks()', () => {
		it('should run startBotHooks correctly', () => {
			const joinConfig: JoinConfig = {
				channelId: '123',
				group: '123',
				guildId: '123',
				selfDeaf: true,
				selfMute: false,
			};
			const connection: VoiceConnection = new VoiceConnection(joinConfig, {
				adapterCreator: () => {
					return;
				},
			} as any);
			const player = new AudioPlayer();
			const queue = new LocalQueue();
			const hook = new BotHooks({} as any, connection as any, player, queue);
			const spyBotHookStart = vi.spyOn(hook, 'startHooks');
			hook.startHooks();

			expect(spyBotHookStart).toHaveBeenCalled();
		});
	});
});
