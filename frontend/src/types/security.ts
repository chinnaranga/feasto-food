export interface PrivacyPreferences {
  personalizationConsent: boolean;
  marketingConsent: boolean;
  locationConsent: boolean;
  cookieConsent: boolean;
}

export * from './privacyConsent';

export type SessionStatus = 'active' | 'idle' | 'warning' | 'expired';

export interface SensitiveActionConfig {
  id: string;
  title: string;
  description: string;
  verificationPhrase?: string; // e.g. "CONFIRM DELETE"
  severity: 'low' | 'medium' | 'high';
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'auth' | 'session' | 'consent' | 'rbac' | 'sensitive_action';
  description: string;
  actor: string;
  ip: string;
}
