import { format, transports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

export const loggerConfig = {
  transports: [
    new DailyRotateFile({
      filename: 'logs/%DATE%-error.log',
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
    new DailyRotateFile({
      filename: 'logs/%DATE%-combined.log',
      format: format.combine(format.timestamp(), format.json()),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
    }),
    new transports.Console({
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf((info) => {
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }),
      ),
    }),
  ],
};
