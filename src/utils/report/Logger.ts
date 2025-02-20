import winston from 'winston';
import path from 'path';

class Logger {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: path.join(__dirname, 'logs', 'app.log') })
            ],
        });
    }

    logFunctionCall(funcName: string, args: Record<string, unknown>): void {
        const params = JSON.stringify(args);
        this.logger.info(`Function: ${funcName} | Parameters: ${params}`);
    }

    log(level: 'info' | 'warn' | 'error' | 'debug', message: string): void {
        this.logger.log(level, message);
    }
}

export default new Logger();
