import { logError,logDebug } from "utils/report/Logger";

// Define an interface for the expected error object
interface ApiErrorResponse {
    status?: number;
    data?: any; // Replace 'any' with a more specific type if known
  }
  
// Custom Error Class for Handling Application Errors
export class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ApiError extends Error {
    constructor(
      message: string,
      public statusCode?: number,
      public response?: any
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }

  export const handleError = (error: any): never => {
    if (error instanceof ApiError) {
      logError(`API Error: ${error.message}`, {
        statusCode: error.statusCode,
        response: error.response
      });
    } else {
      logError('Unexpected error occurred', error);
    }
    throw error;
  };
  
  export const wrapAsync = async <T>(
    fn: () => Promise<T>,
    errorMessage: string
  ): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
        const apiError = error as { response?: ApiErrorResponse }; // Cast error to the expected type
      throw new ApiError(
        errorMessage,
        error?.response?.status,
        error?.response?.data
      );
    }
  };

// Centralized Error Manager Class
class ErrorManager {
    

    constructor() {
      
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
            logError(`App Error: ${error.message} | Status Code: ${error.statusCode}`);
        } else {
            logError(`System Error: ${error.message}`);
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

