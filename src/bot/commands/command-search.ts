import { Message } from 'discord.js';
import { MarliMusic } from '../marli-music';
import { Command } from './command';

export class Search extends Command {
  name = 'search';
  constructor(bot: MarliMusic) {
    super(bot);
  }
  async execute(message: Message, input: string) {
    try {
      await this.validate(message, input);
      const source = this.getSourceStream();
      const searchResult = await source.search(message.content);
      await message.reply(JSON.stringify(searchResult));
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
