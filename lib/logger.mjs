import winston from 'winston'
import 'winston-daily-rotate-file'
import dateFns from 'date-fns'
import { LOG_LEVEL, LOGS_DIR } from './config.mjs'

const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.errors({ stack: true }),
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: `${LOGS_DIR}/combined/%DATE%.log`,
    }),
    new winston.transports.DailyRotateFile({
      filename: `${LOGS_DIR}/error/%DATE%.log`,
      level: 'error',
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(info =>
          `${dateFns.format(new Date(), 'yyyy-MM-dd HH:mm:ss')} ${info.level}: ${info.message}`),
      ),
    }),
  ],
})

export default logger
