import { Message } from 'discord.js'

import { sendCommandError } from '../containts/default-messages'
import { MarliMusic } from '../marli-music'
import { Command } from './command'

export class Search extends Command {
  name = 'search';
  constructor(bot: MarliMusic) {
    super(bot);
  }
  async execute(message: Message, input: string) {
    this.validate(message, input);
    try {
      const source = this.getSourceStream();
      const searchResult = await source.search(message.content);
      message.reply(JSON.stringify(searchResult));
    } catch (err) {
      sendCommandError(err, message);
    }
  }
}
