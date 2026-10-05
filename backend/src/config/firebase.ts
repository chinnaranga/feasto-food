import admin from 'firebase-admin';
import { env } from './env.js';
import { logger } from '../shared/utils/logger.js';

let firebaseApp: admin.app.App | null = null;

export const initFirebase = (): admin.app.App | null => {
  if (!env.FCM_ENABLED) {
    logger.info('🔔 Firebase Cloud Messaging (FCM) is disabled via configuration');
    return null;
  }

  if (firebaseApp) {
    return firebaseApp;
  }

  try {
    if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
      firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      logger.info('🔥 Firebase Admin SDK initialized for FCM push notifications');
    } else {
      logger.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_JSON missing. FCM setup skipped.');
    }
  } catch (error) {
    logger.error({ error }, '❌ Failed to initialize Firebase Admin SDK');
  }

  return firebaseApp;
};

export const getFCM = (): admin.messaging.Messaging | null => {
  const app = initFirebase();
  return app ? app.messaging() : null;
};
