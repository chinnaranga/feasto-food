export interface RecoveryRule {
  errorPattern: RegExp;
  action: 'reload' | 'reload_clear_cache' | 'show_warning';
  message: string;
}

export const recoveryRules: RecoveryRule[] = [
  {
    errorPattern: /Failed to fetch dynamically imported module|error loading dynamically imported module/i,
    action: 'reload_clear_cache',
    message: 'A new version of Feasto is available. Updating cached assets and reloading...',
  },
  {
    errorPattern: /Failed to load resource/i,
    action: 'reload',
    message: 'Failed to retrieve application resources. Attempting to reload page...',
  },
];
export default recoveryRules;
