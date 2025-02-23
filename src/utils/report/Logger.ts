import winston from 'winston';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
  
  export const logInfo = (message: string, meta?: any) => {
    logger.info(message, meta);
  };
  
  export const logError = (message: string, error?: any) => {
    logger.error(message, { error });
  };
  
  export const logDebug = (message: string, meta?: any) => {
    logger.debug(message, meta);
  };

  export const logFunctionCall = (funcName: string, args: Record<string, unknown>)=> {
    const params = JSON.stringify(args);
    logger.info(`Function: ${funcName} | Parameters: ${params}`);
}


  
  export default logger;
