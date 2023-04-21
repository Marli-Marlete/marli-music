import dayjs from "dayjs";
import winston, {format, transports} from "winston"


const logsFolder = () => 
  `logs/winston/${dayjs().format("MM-YYYY")}`

const logFile = () => `${dayjs().format('DD-MM-YYYY')}.log`

export const logger = winston.createLogger({
  format: format.combine(format.json(), format.timestamp(), format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })),
  level: "debug",
  transports: [
    new transports.File({
      dirname: logsFolder(),
      filename: logFile(),
    }),
    new winston.transports.Console({
      level: 'debug'
    })
  ],
  
});




