import { Message } from 'discord.js';
import { SourceStream } from './../../sources/source-stream';
import { Command } from './command';
import { sendCommandError } from 'bot/containts/default-messages';

export class Search extends Command {
	name = 'search';
	constructor(private source: SourceStream) {
		super();
	}
	async execute(message: Message) {
		this.validate(message, message.content);
		try {
			const searchResult = await this.source.search(message.content);
			message.reply(JSON.stringify(searchResult));
		} catch (err) {
			sendCommandError(err, message);
		}
	}
}
