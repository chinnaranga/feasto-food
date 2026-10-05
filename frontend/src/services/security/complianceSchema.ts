import { SensitiveActionConfig } from '../../types/security';

export const COMPLIANCE_VERSION = '2026.1';

export const SENSITIVE_ACTIONS_REGISTRY: Record<string, Omit<SensitiveActionConfig, 'id'>> = {
  delete_account: {
    title: 'Irreversible Account Deletion',
    description: 'Permanently remove your Feasto account, accumulated loyalty rewards points, and active subscription. This cannot be undone.',
    verificationPhrase: 'CONFIRM DELETE',
    severity: 'high',
  },
  change_password: {
    title: 'Change Password Verification',
    description: 'Update your access credentials. This will terminate other active sessions immediately.',
    severity: 'medium',
  },
  export_data: {
    title: 'Personal Data Archive Request',
    description: 'Request a copy of your personal profile data, order ledger, and activity logs. Your package compiles in 24 hours.',
    severity: 'medium',
  },
  admin_suspend_merchant: {
    title: 'Suspend Merchant Listing',
    description: 'Immediately lock restaurant storefront access, hide menus from discovery, and notify merchant owners.',
    verificationPhrase: 'CONFIRM SUSPEND',
    severity: 'high',
  },
};
