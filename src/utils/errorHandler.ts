import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  code: string;
}

export const handleApiError = (error: any): ApiError => {
  if (error.code === 'ECONNREFUSED' || error.response?.status === 503) {
    return {
      message: 'Backend server is not running. Please start the backend server.',
      code: 'CONNECTION_ERROR'
    };
  }

  if (!error.response) {
    return {
      message: 'Network error. Please check your internet connection.',
      code: 'NETWORK_ERROR'
    };
  }

  const status = error.response.status;
  const message = error.response.data?.message || 'An error occurred';

  switch (status) {
    case 401:
      return {
        message: 'Please log in to continue.',
        code: 'AUTH_ERROR'
      };
    case 403:
      return {
        message: 'You do not have permission to perform this action.',
        code: 'FORBIDDEN'
      };
    case 404:
      return {
        message: 'The requested resource was not found.',
        code: 'NOT_FOUND'
      };
    case 422:
      return {
        message: message,
        code: 'VALIDATION_ERROR'
      };
    case 500:
      return {
        message: 'Server error. Please try again later.',
        code: 'SERVER_ERROR'
      };
    default:
      return {
        message: message,
        code: 'API_ERROR'
      };
  }
}; 
 