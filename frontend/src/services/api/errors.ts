import { ApiErrorData } from '@/types/api/common';

export class ApiError extends Error implements ApiErrorData {
  status: number;
  code: string;
  details?: any;
  requestId?: string;

  constructor(status: number, code: string, message: string, details?: any, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.requestId = requestId;
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication failed', details?: any) {
    super(401, 'UNAUTHORIZED', message, details);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message = 'Forbidden access', details?: any) {
    super(403, 'FORBIDDEN', message, details);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Requested resource not found', details?: any) {
    super(404, 'NOT_FOUND', message, details);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed', details?: any) {
    super(422, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends ApiError {
  constructor(message = 'Feasto payment services are temporarily unavailable.') {
    super(0, 'NETWORK_ERROR', message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ApiError {
  constructor(message = 'Request execution timed out. Please try again.') {
    super(408, 'REQUEST_TIMEOUT', message);
    this.name = 'TimeoutError';
  }
}

export class ServerError extends ApiError {
  constructor(message = 'Payment service is temporarily unavailable.', status = 500) {
    super(status, 'SERVER_ERROR', message);
    this.name = 'ServerError';
  }
}

export function isNetworkFailure(err: any): boolean {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  return (
    err instanceof TypeError &&
    (msg.includes('failed to fetch') ||
      msg.includes('network error') ||
      msg.includes('connection refused') ||
      msg.includes('load failed') ||
      msg.includes('err_connection_refused'))
  );
}

export function normalizeError(err: any, status?: number): ApiError {
  if (err instanceof ApiError) return err;

  // Check explicit network connection drops & connection refused
  if (isNetworkFailure(err) || (!navigator.onLine && !status)) {
    return new NetworkError('Feasto payment services are temporarily unavailable.');
  }

  // Check timeout / abort errors
  if (err?.name === 'AbortError' || status === 408) {
    return new TimeoutError('Request execution timed out. Please try again.');
  }

  const effectiveStatus = status || (typeof err?.status === 'number' ? err.status : 500);
  const msg = err?.message || 'An unexpected error occurred';

  if (effectiveStatus === 401) return new AuthenticationError(msg);
  if (effectiveStatus === 403) return new AuthorizationError(msg);
  if (effectiveStatus === 404) return new NotFoundError(msg);
  if (effectiveStatus === 422 || effectiveStatus === 400) return new ValidationError(msg, err?.details);
  if (effectiveStatus >= 500) return new ServerError(msg, effectiveStatus);

  return new ApiError(effectiveStatus, 'UNKNOWN_ERROR', msg);
}
