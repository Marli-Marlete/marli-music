import { Message } from 'discord.js';
import { Command } from './command';
import { MarliMusic } from 'bot/marli-music';
import { ListQueue } from './command-list-queue';

export class Shuffle extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
    this.name = 'shuffle';
  }

  async execute(message: Message<boolean>, _input?: string): Promise<void> {
    try {

      this.getQueue().shuffle(message.member.voice.channelId);

      new ListQueue(this.bot).execute(message);
    } catch (error) {
      await this.sendCommandError(error, message);
    }
  }
}
