import crypto from 'crypto';

export function generateAuditId(): string {
  return `aud_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateSettingId(): string {
  return `set_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateAccessId(): string {
  return `acc_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

export function generateVerificationId(): string {
  return `vrf_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}
