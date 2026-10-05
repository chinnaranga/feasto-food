import { Response } from 'express';
import { HttpStatusCode, HttpStatus } from '../constants/httpStatusCodes.js';
import { APIResponse, PaginatedAPIResponse, PaginatedMeta } from '../types/response.js';

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: HttpStatusCode = HttpStatus.OK
): Response<APIResponse<T>> => {
  const response: APIResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  pagination: PaginatedMeta,
  message?: string,
  statusCode: HttpStatusCode = HttpStatus.OK
): Response<PaginatedAPIResponse<T>> => {
  const response: PaginatedAPIResponse<T> = {
    success: true,
    message,
    data,
    pagination,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  code: string = 'ERROR',
  statusCode: HttpStatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: unknown
): Response<APIResponse> => {
  const response: APIResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
};
