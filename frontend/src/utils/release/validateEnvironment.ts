import { MANDATORY_ENV_KEYS, OPTIONAL_ENV_KEYS } from '../../constants/release';
import { EnvValidationResult, EnvKeyValidation } from '../../types/release';

export const validateEnvironment = (): EnvValidationResult => {
  const results: EnvKeyValidation[] = [];
  let isValid = true;

  MANDATORY_ENV_KEYS.forEach(({ key, description }) => {
    const value = import.meta.env[key];
    const exists = typeof value === 'string' && value.trim().length > 0;
    if (!exists) {
      isValid = false;
    }
    results.push({ key, exists, isRequired: true, description });
  });

  OPTIONAL_ENV_KEYS.forEach(({ key, description }) => {
    const value = import.meta.env[key];
    const exists = typeof value === 'string' && value.trim().length > 0;
    results.push({ key, exists, isRequired: false, description });
  });

  return { isValid, results };
};
export default validateEnvironment;
