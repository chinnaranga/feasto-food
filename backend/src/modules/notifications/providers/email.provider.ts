import { logger } from '../../../shared/utils/logger.js';

export class EmailProvider {
  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<string> {
    logger.info(`[EmailProvider] Sent email to "${to}" with subject: "${subject}"`);
    return `email_msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
}

export const emailProvider = new EmailProvider();
