import { EventCategory, SeverityLevel } from '../types/observability';

export const TELEMETRY_CONSENT_KEY = 'feasto_telemetry_consent';
export const DIAGNOSTIC_LOGS_KEY = 'feasto_diagnostic_logs';

export const REDACTION_KEYS = [
  'password',
  'passwordConfirm',
  'oldPassword',
  'newPassword',
  'cardNumber',
  'cvv',
  'cvc',
  'token',
  'accessToken',
  'refreshToken',
  'otp',
  'code',
  'phone',
  'phoneNumber',
  'email',
  'address',
  'name',
  'displayName',
  'street',
  'city',
  'zip',
  'zipCode',
  'cardholder',
];

export const MAX_EVENT_LOGS = 50;
export const MAX_ACTION_STACK = 10;

export const PERFORMANCE_THRESHOLDS = {
  slowRenderMs: 300,
  slowRouteTransitionMs: 800,
  slowSearchMs: 400,
  slowCheckoutMs: 1200,
};

export const SEVERITIES: SeverityLevel[] = ['info', 'warn', 'error', 'fatal'];

export const CATEGORIES: EventCategory[] = [
  'route',
  'component',
  'network',
  'form',
  'security',
  'pwa',
  'release',
  'interaction',
  'auth',
];
