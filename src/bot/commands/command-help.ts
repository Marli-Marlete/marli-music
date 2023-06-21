import { Message } from 'discord.js';
import { MarliMusic } from '../marli-music';
import { Command } from './command';
import { ALL_COMMANDS } from './command-map';

export class CommandHelp extends Command {
  name = 'help';
  constructor(bot: MarliMusic) {
    super(bot);
  }
  async execute(message: Message) {
    try {
      await this.validate(message, 'help');
      const commands = Object.keys(ALL_COMMANDS);
      message.reply(
        `Type: ${this.bot.prefix}<command> \n\nAll Commands:\n${commands.join(
          '\n'
        )}`
      );
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
