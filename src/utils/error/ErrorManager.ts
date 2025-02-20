import winston from 'winston';

// Custom Error Class for Handling Application Errors
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

// Centralized Error Manager Class
class ErrorManager {
    private logger: winston.Logger;

    constructor() {
        this.logger = winston.createLogger({
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
                })
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'logs/errors.log' }),
            ],
        });

        // Handle Uncaught Exceptions & Rejections
        process.on('uncaughtException', (err) => {
            this.handleError(new AppError(err.message, 500));
        });

        process.on('unhandledRejection', (err: any) => {
            this.handleError(new AppError(err.message || 'Unhandled Rejection', 500));
        });
    }

    // Log and Handle Error
    handleError(error: Error | AppError): void {
        if (error instanceof AppError) {
            this.logger.error(`App Error: ${error.message} | Status Code: ${error.statusCode}`);
        } else {
            this.logger.error(`System Error: ${error.message}`);
        }
    }

    // Express Middleware for Handling Errors
    expressErrorHandler() {
        return (err: Error | AppError, req: any, res: any, next: any) => {
            this.handleError(err);
            res.status(err instanceof AppError ? err.statusCode : 500).json({
                success: false,
                message: err.message || 'Internal Server Error',
            });
        };
    }
}

export default new ErrorManager();


//How to handle error
// import ErrorManager, { AppError } from './ErrorManager';

// function riskyOperation() {
//     try {
//         throw new AppError("Resource Not Found", 404);
//     } catch (error) {
//         ErrorManager.handleError(error);
//     }
// }

// riskyOperation();

