import winston, {
  Logger as WinstonLogger,
  LoggerOptions,
  format,
} from 'winston';
import { TransformableInfo } from 'logform';
import { inspect } from 'util';
import fs from 'fs';
// Types
type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';
type LogMethod = (message: string, meta?: unknown) => void;

// Constants
const LOGS_DIRECTORY = 'logs';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

// Custom formatter for console output
const consoleFormat = format.combine(
  format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
  format.errors({ stack: true }),
  format.colorize({ all: true }),
  format.printf((info: TransformableInfo) => {
    const { timestamp, level, message, stack, ...meta } = info;
    let log = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      log += `\n${inspect(meta, { depth: null, colors: true })}`;
    }

    return stack ? `${log}\n${stack}` : log;
  })
);

// File format (JSON)
const fileFormat = format.combine(
  format.timestamp(),
  format.json(),
  format.errors({ stack: true })
);

// Create logs directory if it doesn't exist

if (!fs.existsSync(LOGS_DIRECTORY)) {
  fs.mkdirSync(LOGS_DIRECTORY);
}

// Logger configuration
const loggerConfig: LoggerOptions = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: fileFormat,
  defaultMeta: { service: 'job-posting-service' },
  transports: [
    // Error logs
    new winston.transports.File({
      filename: `${LOGS_DIRECTORY}/error.log`,
      level: 'error',
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
    }),
    // Combined logs
    new winston.transports.File({
      filename: `${LOGS_DIRECTORY}/combined.log`,
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
    }),
    // Console (only in development)
    ...(process.env.NODE_ENV !== 'production'
      ? [
        new winston.transports.Console({
          format: consoleFormat,
        }),
      ]
      : []),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({
      filename: `${LOGS_DIRECTORY}/exceptions.log`,
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: `${LOGS_DIRECTORY}/rejections.log`,
      maxsize: MAX_FILE_SIZE,
      maxFiles: MAX_FILES,
    }),
  ],
  // Exit on error, set to false if using with express
  exitOnError: false,
};

// Create logger instance
const logger: WinstonLogger = winston.createLogger(loggerConfig);

// Add console transport in production (without colors)
if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: format.combine(format.timestamp(), format.json()),
    })
  );
}

// Log method with type safety
const log = (level: LogLevel, message: string, meta?: unknown): void => {
  logger.log(level, message, {
    ...(meta && typeof meta === 'object' ? meta : { meta }),
  });
};

// Public API
export const logInfo: LogMethod = (message, meta) => log('info', message, meta);
export const logError: LogMethod = (message, error) =>
  log('error', message, error);
export const logWarn: LogMethod = (message, meta) => log('warn', message, meta);
export const logDebug: LogMethod = (message, meta) =>
  log('debug', message, meta);
export const logHttp: LogMethod = (message, meta) => log('http', message, meta);

export const logFunctionCall = (
  funcName: string,
  args: Record<string, unknown>
): void => {
  logInfo(`Function: ${funcName} called`, {
    parameters: args,
    timestamp: new Date().toISOString(),
  });
};

// Export the logger instance
export default logger;

//Example code to use logger
// import { logInfo, logError } from './logger';

// Basic usage
// logInfo('Application started');
// logError('Something went wrong', error);

// With metadata
// logInfo('User logged in', { userId: 123, ip: '192.168.1.1' });

// // Function call logging
// logFunctionCall('processUser', { userId: 123, action: 'login' });
