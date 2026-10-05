import { redactSensitiveFields as redact } from '../../services/observability/redaction';

export const redactSensitiveFields = (data: any): any => {
  return redact(data);
};
export default redactSensitiveFields;
