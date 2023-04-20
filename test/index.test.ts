import test from 'ava';
import { after, before, describe, it } from 'node:test';
import Sinon from 'sinon';
import { botStartup } from '../src/bot/';

test('index.ts', (t) => {
	const botToken = 'TEST_TOKEN';
	const botPrefix = '/';
	before(() => {
		Sinon.spy(botStartup);
	});

	after(() => {
		Sinon.restore();
	});

	describe('bot env vars should be set', () => {
		t.deepEqual(process.env.BOT_TOKEN, botToken);
		t.deepEqual(process.env.BOT_PREFIX, botPrefix);
	});

	it('botStartup should run correctly', () => {
		t.assert(botStartup, 'should exists');
	});
});
