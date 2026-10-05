import { logger } from '../../../shared/utils/logger.js';

export class SMSProvider {
  async sendSMS(phoneNumber: string, text: string): Promise<string> {
    logger.info(`[SMSProvider] Sent SMS to "${phoneNumber}": "${text}"`);
    return `sms_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export const smsProvider = new SMSProvider();
