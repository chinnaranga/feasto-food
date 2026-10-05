import { SensitiveActionConfig } from '../../types/security';
import { SENSITIVE_ACTIONS_REGISTRY } from './complianceSchema';

export const confirmationRules = {
  // Retrieve config for a specific action key
  getActionConfig: (actionKey: string): SensitiveActionConfig => {
    const reg = SENSITIVE_ACTIONS_REGISTRY[actionKey];
    return {
      id: actionKey,
      title: reg?.title || 'Sensitive Action Confirmation',
      description: reg?.description || 'This action requires administrative confirmation to proceed.',
      verificationPhrase: reg?.verificationPhrase,
      severity: reg?.severity || 'medium',
    };
  },

  // Check if a sensitive action requires double confirmation (phrase matching)
  requiresPhraseVerification: (config: SensitiveActionConfig): boolean => {
    return !!config.verificationPhrase;
  },
};
