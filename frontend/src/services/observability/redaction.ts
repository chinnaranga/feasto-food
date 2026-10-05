import { REDACTION_KEYS } from '../../constants/observability';

export const redactSensitiveFields = (data: any): any => {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveFields(item));
  }

  // Handle objects
  if (typeof data === 'object') {
    // If it's a special type like Date, don't try to redact its keys
    if (data instanceof Date || data instanceof RegExp) {
      return data;
    }

    const redacted: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      const lowerKey = key.toLowerCase();
      
      if (REDACTION_KEYS.some((redactKey) => lowerKey.includes(redactKey.toLowerCase()))) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactSensitiveFields(data[key]);
      }
    }
    return redacted;
  }

  // Handle strings that look like emails or phone numbers/tokens (optional check, key-based is primary)
  if (typeof data === 'string') {
    // Basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(data)) {
      return '[REDACTED_EMAIL]';
    }
    
    // Basic JWT check
    if (data.startsWith('eyJhbGciOi') && data.split('.').length === 3) {
      return '[REDACTED_TOKEN]';
    }
  }

  return data;
};
export default redactSensitiveFields;
