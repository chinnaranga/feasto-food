import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class ConflictError extends AppError {
  constructor(message = 'Resource state conflict') {
    super(message, HttpStatus.CONFLICT);
  }
}
