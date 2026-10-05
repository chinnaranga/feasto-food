import { getFCM } from '../../../config/firebase.js';
import { logger } from '../../../shared/utils/logger.js';

export class PushNotificationProvider {
  async send(token: string, title: string, body: string, data?: Record<string, any>): Promise<string> {
    const messaging = getFCM();
    if (!messaging) {
      logger.info(`[PushProvider (FCM Disabled/Mock)] Sending to token: ${token.substring(0, 10)}... Title: "${title}"`);
      return `mock_fcm_msg_${Date.now()}`;
    }

    try {
      const response = await messaging.send({
        token,
        notification: { title, body },
        data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : undefined,
      });
      return response;
    } catch (err: any) {
      logger.error(`[PushProvider] FCM Send error: ${err.message}`);
      throw err;
    }
  }

  async sendBatch(tokens: string[], title: string, body: string, data?: Record<string, any>): Promise<number> {
    let successCount = 0;
    for (const token of tokens) {
      try {
        await this.send(token, title, body, data);
        successCount++;
      } catch {
        // Continue batch
      }
    }
    return successCount;
  }
}

export const pushProvider = new PushNotificationProvider();
