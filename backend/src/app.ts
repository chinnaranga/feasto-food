import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { securityHeaders } from './shared/middleware/securityHeaders.js';
import { requestLogger } from './shared/middleware/requestLogger.js';
import { globalRateLimiter } from './shared/middleware/rateLimiter.js';
import { notFoundHandler } from './shared/middleware/notFound.js';
import { errorHandler } from './shared/middleware/errorHandler.js';
import { sendSuccess } from './shared/utils/response.js';
import apiRouter from './routes/index.js';

export const createApp = (): Application => {
  const app: Application = express();

  // Trust Render reverse proxy for accurate IP and rate-limiting
  app.set('trust proxy', 1);

  // 1. Security Headers
  app.use(securityHeaders);

  // 2. CORS Configuration
  const configuredOrigins = (env.CORS_ORIGINS || '').split(',').map((o: string) => o.trim()).filter(Boolean);
  const defaultAllowedOrigins = [
    'https://feasto.food',
    'https://www.feasto.food',
    'https://food-platform-b022f.web.app',
    'https://food-platform-b022f.firebaseapp.com',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  const allAllowed = Array.from(new Set([...configuredOrigins, ...defaultAllowedOrigins]));

  app.use(
    cors({
      origin: (origin, callback) => {
        if (
          !origin ||
          allAllowed.includes(origin) ||
          origin.endsWith('.onrender.com') ||
          origin.endsWith('.web.app') ||
          origin.endsWith('.firebaseapp.com') ||
          origin.includes('feasto.food') ||
          env.NODE_ENV === 'development'
        ) {
          callback(null, true);
        } else {
          callback(new Error(`Origin '${origin}' not permitted by CORS policy`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-ID'],
    })
  );

  // 3. Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. HTTP Request Logger
  if (env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }

  // 5. Global Rate Limiter
  app.use('/api', globalRateLimiter);

  // 6. Root Landing Route
  app.get('/', (_req: Request, res: Response) => {
    sendSuccess(
      res,
      {
        name: 'Feasto Backend V2 Platform API',
        version: '2.0.0',
        docsUrl: '/api/v1/docs',
        healthUrl: '/api/v1/health',
      },
      'Welcome to Feasto Platform API V2'
    );
  });

  // 7. OpenAPI / Swagger Documentation
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 8. Base API V1 Router
  app.use('/api/v1', apiRouter);

  // 9. 404 Not Found Handler
  app.use(notFoundHandler);

  // 10. Global Operational Error Handler
  app.use(errorHandler);

  return app;
};

export default createApp;
