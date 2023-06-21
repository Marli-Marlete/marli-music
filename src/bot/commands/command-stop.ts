import { Message } from 'discord.js';
import { BOT_MESSAGES } from '../containts/default-messages';
import { MarliMusic } from '../marli-music';
import { Command } from './command';

export class Stop extends Command {
  constructor(bot: MarliMusic) {
    super(bot);
    this.name = 'stop';
  }
  async execute(message: Message): Promise<void> {
    try {
      await this.validate(message, 'stop');
      const connectionID = message.member.voice.channelId;
      const player = this.getPlayer(connectionID);
      const queue = this.getQueue();
      player.stop();
      queue.clear(connectionID);
      await message.reply({
        content: `${message.author.username} ${BOT_MESSAGES.MUSIC_STOPPED}`,
      });
    } catch (err) {
      await this.sendCommandError(err, message);
    }
  }
}
