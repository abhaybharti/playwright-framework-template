import { logError } from '../report/Logger';

// Define an interface for the expected error object
interface ApiErrorResponse {
    response?: {
      status?: number;
      data?: any; // Replace 'any' with a more specific type if known
    };
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
    const apiError = error as ApiErrorResponse; // Cast error to the expected type
    throw new ApiError(
      errorMessage,
      apiError?.response?.status,
      apiError?.response?.data
    );
  }
};