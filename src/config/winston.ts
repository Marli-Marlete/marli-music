import dayjs from 'dayjs'
import { join } from 'path'
import { cwd } from 'process'
import winston, { format, transports } from 'winston'

class Logger {
  private logger: winston.Logger;
  constructor(private options: { saveToFile: boolean }) {
    this.logger = this.makeLogger();
  }

  public log(level: string, message: string, error?: Error) {
    return this.logger.log(level, message, error);
  }

  private makeLogger() {
    return winston.createLogger({
      format: format.combine(
        format.json(),
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
          return `[${timestamp}] ${level}: ${message}`;
        }),
      ),
      level: 'debug',
      transports: this.options.saveToFile
        ? [
          new winston.transports.Console(),
          new transports.File({
            dirname: this.makeFolderName(),
            filename: this.makeFileName(),
          }),
				  ]
        : [new winston.transports.Console()],
    });
  }

  private makeFolderName() {
    return join(cwd(), `logs/winston/${dayjs().format('MM-YYYY')}`);
  }
  private makeFileName() {
    return `${dayjs().format('DD-MM-YYYY')}.log`;
  }
}

export const logger = new Logger({ saveToFile: false });
export const fileLogger = new Logger({ saveToFile: true });
