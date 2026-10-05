import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden: insufficient permissions', details?: unknown) {
    super(message, HttpStatus.FORBIDDEN, 'FORBIDDEN', details);
  }
}
