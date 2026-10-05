import { AppError } from './AppError.js';
import { HttpStatus } from '../constants/httpStatusCodes.js';

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', details?: unknown) {
    super(message, HttpStatus.BAD_REQUEST, 'BAD_REQUEST', details);
  }
}
