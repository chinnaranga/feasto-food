import { SensitiveActionConfig } from '../../types/security';

// Compares inputted confirmation text with action requirements
export const confirmSensitiveAction = (
  config: SensitiveActionConfig,
  phraseInput: string
): boolean => {
  if (!config.verificationPhrase) return true;
  return phraseInput.trim() === config.verificationPhrase;
};
export default confirmSensitiveAction;
