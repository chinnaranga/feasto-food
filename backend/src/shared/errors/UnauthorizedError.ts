import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required', details?: unknown) {
    super(message, HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED', details);
  }
}
