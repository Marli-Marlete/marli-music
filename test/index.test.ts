import test from 'ava';
import { after, before, describe, it } from 'node:test';
import Sinon from 'sinon';
import { botStartup } from '../src/bot/';
import { initConfigs } from '../src/config';
import { MarliMusic } from '../src/bot/marli-music';

test('index.ts', (t) => {
	const botToken = 'TEST_TOKEN';
	const botPrefix = '/';

	before(() => {});

	after(() => {
		Sinon.restore();
	});

	it('initConfigs should run correctly', () => {
		const fakeBotStartup = Sinon.spy(initConfigs);
		t.deepEqual(fakeBotStartup.calledOnce, true, 'should be called onced');
	});

	describe('bot env vars should be set', () => {
		t.deepEqual(process.env.BOT_TOKEN, botToken);
		t.deepEqual(process.env.BOT_PREFIX, botPrefix);
	});

	it('botStartup should run correctly', () => {
		const fakeBotStartup = Sinon.spy(botStartup);
		t.deepEqual(fakeBotStartup.calledOnce, true, 'should be called onced');
	});

	it('botStartup should run correctly', () => {
		const fakeBotStartup = Sinon.stub(botStartup, () => {
			return new MarliMusic();
		});
		t.deepEqual(fakeBotStartup.calledOnce, true, 'should be called onced');
	});
});
