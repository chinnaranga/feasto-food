import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class NotFoundError extends AppError {
  constructor(message: string = 'Requested resource not found', details?: unknown) {
    super(message, HttpStatus.NOT_FOUND, 'NOT_FOUND', details);
  }
}
