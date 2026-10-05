import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodIssue } from 'zod';
import { ValidationError } from '../errors/ValidationError.js';

export const validateRequest = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}) => {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const details = error.errors.map((e: ZodIssue) => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        next(new ValidationError('Request validation failed', details));
      } else {
        next(error);
      }
    }
  };
};

export const commonSchemas = {
  mongoId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId'),
  paginationQuery: z.object({
    page: z.string().optional().transform((val?: string) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
    limit: z.string().optional().transform((val?: string) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 10)),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid E.164 format phone number'),
};
