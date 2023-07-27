import { Client, ClientOptions, Message } from 'discord.js';

import { AudioPlayer } from '@discordjs/voice';

import { sentryCapture } from '../config/sentry';
import { logger } from '../config/winston';
import { Queue } from '../queue/queue';
import { ERRORS } from '../shared/errors';
import { SourceStream } from '../sources/source-stream';
import { BOT_MESSAGES } from './containts/default-messages';
import { ALL_COMMANDS, Command } from './commands';
import { CommandHelp } from './commands/command-help';

export interface BotInfo {
  prefix: string;
  token: string;
}

export class MarliMusic extends Client {
  prefix: string;
  players: Map<string, AudioPlayer> = new Map();
  static MAX_REPLY_CONTENT_LENGTH = 2000;

  constructor(
    private botInfo: BotInfo,
    public sourceStream: SourceStream,
    public queue: Queue,
    options?: ClientOptions
  ) {
    super(options);

    this.prefix = botInfo.prefix;

    this.login(this.botInfo.token).catch((reason) => {
      logger.log('error', ERRORS.BOT_STARTUP_ERROR, reason);
      sentryCapture(ERRORS.BOT_STARTUP_ERROR, new Error(reason));
    });

    this.once('ready', () => {
      this.healthCheck();
    });

    this.on('error', (error: Error) => {
      logger.error(ERRORS.BOT_STARTUP_ERROR, error);
      sentryCapture(ERRORS.BOT_STARTUP_ERROR, error);
    });

    this.on('messageCreate', async (message: Message) =>
      this.onMessage(message)
    );
  }

  public healthCheck() {
    const healthString = `${this.user.username} online ${this.uptime}`;
    logger.log('debug', healthString);
    return healthString;
  }

  public addPlayer(connection: string) {
    this.players.set(connection, new AudioPlayer());
  }

  public getPlayer(connection: string) {
    if (!this.players.has(connection)) {
      this.addPlayer(connection);
    }
    return this.players.get(connection);
  }

  public removePlayer(connection: string) {
    this.players.delete(connection);
  }

  private async onMessage(message: Message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(this.prefix)) return;

    const args = message.content.split(' ');
    const input = message.content.replace(args[0], '');
    const commandString = args[0].replace(this.prefix, '');

    if (!ALL_COMMANDS[commandString]) {
      await message.reply(BOT_MESSAGES.INVALID_COMMAND);
      await new CommandHelp(this).execute(message);
      return;
    }

    const command: Command = new ALL_COMMANDS[commandString](this);

    await command.execute(message, input);
  }
}
