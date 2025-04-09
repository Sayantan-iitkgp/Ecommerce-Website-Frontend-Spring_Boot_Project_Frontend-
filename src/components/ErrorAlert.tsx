import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';
import { ApiError } from '../utils/errorHandler';

interface ErrorAlertProps {
  error: ApiError | string | null;
  onClose?: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onClose }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorTitle = typeof error === 'string' ? 'Error' : getErrorTitle(error.code);

  return (
    <Box sx={{ mb: 2 }}>
      <Alert 
        severity="error" 
        onClose={onClose}
        sx={{ width: '100%' }}
      >
        <AlertTitle>{errorTitle}</AlertTitle>
        {errorMessage}
      </Alert>
    </Box>
  );
};

const getErrorTitle = (code?: string): string => {
  switch (code) {
    case 'AUTH_ERROR':
      return 'Authentication Error';
    case 'NETWORK_ERROR':
      return 'Network Error';
    case 'SERVER_ERROR':
      return 'Server Error';
    case 'VALIDATION_ERROR':
      return 'Validation Error';
    case 'NOT_FOUND':
      return 'Not Found';
    case 'FORBIDDEN':
      return 'Access Denied';
    case 'API_ERROR':
      return 'API Error';
    case 'UNKNOWN_ERROR':
    default:
      return 'Error';
  }
};

export default ErrorAlert; 