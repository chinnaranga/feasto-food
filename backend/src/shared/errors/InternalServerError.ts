import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class InternalServerError extends AppError {
  constructor(message: string = 'An unexpected internal server error occurred', details?: unknown) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, 'INTERNAL_SERVER_ERROR', details);
  }
}
