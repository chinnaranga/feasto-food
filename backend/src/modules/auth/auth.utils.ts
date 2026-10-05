import crypto from 'crypto';
import { Request } from 'express';
import { ClientMetadata } from './auth.types.js';

export const generateNumericOTP = (length: number = 6): string => {
  const digits = '0123456789';
  let otp = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[randomBytes[i] % 10];
  }
  return otp;
};

export const hashCode = (code: string): string => {
  return crypto.createHash('sha256').update(code).digest('hex');
};

export const parseClientMetadata = (req: Request): ClientMetadata => {
  const userAgent = req.headers['user-agent'] || 'Unknown User-Agent';
  const ipAddress =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket.remoteAddress ||
    '127.0.0.1';

  let browser = 'Unknown Browser';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';

  let deviceName = 'Web App';
  if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
    deviceName = 'Mobile App';
  }

  return {
    ipAddress,
    userAgent,
    browser,
    deviceName,
  };
};
