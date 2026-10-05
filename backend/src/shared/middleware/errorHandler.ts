import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';
import { env } from '../../config/env.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    logger.warn(
      {
        path: req.path,
        method: req.method,
        statusCode: err.statusCode,
        code: err.errorCode,
        message: err.message,
        details: err.details,
      },
      `Operational Error: ${err.message}`
    );

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: err.details || null,
      },
      timestamp,
    });
    return;
  }

  // Handle Mongoose CastError / ValidationError
  if (err.name === 'CastError') {
    res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'INVALID_ID',
        message: 'Resource identifier provided is malformed',
        details: null,
      },
      timestamp,
    });
    return;
  }

  // Handle unexpected non-operational errors
  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
      stack: err.stack,
    },
    '🔥 Unhandled Internal Server Error'
  );

  const isDev = env.NODE_ENV === 'development';

  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDev ? err.message : 'An unexpected error occurred on the server',
      details: isDev ? err.stack : null,
    },
    timestamp,
  });
};
