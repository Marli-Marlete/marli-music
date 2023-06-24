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
      const limited = searchResult.slice(0, 10);
      await message.reply(
        limited
          .map(
            (item, index) =>
              `\n${index + 1} - ${item.title} - ${item.duration} - ${item.url}`
          )
          .join(' ')
      );
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
