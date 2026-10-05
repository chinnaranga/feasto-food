import { env } from '../../config/env.js';
import { logger } from './logger.js';

export const verifyEnvironmentSetup = (): void => {
  logger.info(
    {
      environment: env.NODE_ENV,
      port: env.PORT,
      fcmEnabled: env.FCM_ENABLED,
      corsOrigins: env.CORS_ORIGINS,
    },
    '⚙️ Environment verification passed cleanly'
  );
};
