export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export class ErrorHandler {
  static handle(error: any): AppError {
    console.error('Error occurred:', error);

    // Handle Supabase errors
    if (error?.code) {
      switch (error.code) {
        case 'PGRST116':
          return {
            message: 'Record not found',
            code: 'NOT_FOUND',
            status: 404
          };
        case '23505':
          return {
            message: 'Duplicate entry found',
            code: 'DUPLICATE_ENTRY',
            status: 409
          };
        case '23503':
          return {
            message: 'Referenced record does not exist',
            code: 'FOREIGN_KEY_VIOLATION',
            status: 400
          };
        case '42P01':
          return {
            message: 'Table does not exist',
            code: 'TABLE_NOT_FOUND',
            status: 500
          };
        default:
          return {
            message: error.message || 'Database error occurred',
            code: error.code,
            status: 500
          };
      }
    }

    // Handle network errors
    if (error?.name === 'NetworkError' || error?.message?.includes('network')) {
      return {
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
        status: 0
      };
    }

    // Handle authentication errors
    if (error?.message?.includes('auth') || error?.message?.includes('login')) {
      return {
        message: 'Authentication failed. Please check your credentials.',
        code: 'AUTH_ERROR',
        status: 401
      };
    }

    // Handle validation errors
    if (error?.message?.includes('validation') || error?.message?.includes('invalid')) {
      return {
        message: error.message || 'Invalid data provided',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }

    // Default error
    return {
      message: error?.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
      status: 500,
      details: error
    };
  }

  static isNetworkError(error: any): boolean {
    return error?.code === 'NETWORK_ERROR' || error?.name === 'NetworkError';
  }

  static isAuthError(error: any): boolean {
    return error?.code === 'AUTH_ERROR' || error?.status === 401;
  }

  static isNotFoundError(error: any): boolean {
    return error?.code === 'NOT_FOUND' || error?.status === 404;
  }

  static isValidationError(error: any): boolean {
    return error?.code === 'VALIDATION_ERROR' || error?.status === 400;
  }

  static getErrorMessage(error: any): string {
    const appError = this.handle(error);
    return appError.message;
  }

  static logError(error: any, context?: string) {
    const appError = this.handle(error);
    console.error(`[${context || 'App'}] Error:`, {
      message: appError.message,
      code: appError.code,
      status: appError.status,
      details: appError.details
    });
  }
}

// Toast error handler
export const showErrorToast = (error: any, context?: string) => {
  const appError = ErrorHandler.handle(error);
  // Note: Import toast from sonner in the component where this is used
  console.error(appError.message);
  ErrorHandler.logError(error, context);
};

// API response handler
export const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
};

// Retry mechanism for network requests
export const retryRequest = async <T>(
  requestFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      if (!ErrorHandler.isNetworkError(error) || attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError;
}; 