export const PWA_CACHE_NAMES = {
  SHELL: 'feasto-shell-v1',
  ASSETS: 'feasto-assets-v1',
  API: 'feasto-api-v1',
};

export const PWA_STORE_PERSIST_KEY = 'feasto-pwa-state';

export const PWA_MESSAGES = {
  OFFLINE: 'You are offline. Cached items are still available.',
  ONLINE: 'Your connection has been restored.',
  SLOW_CONNECTION: 'Slow connection detected. Some features may load slowly.',
  UPDATE_READY: 'A new version of Feasto is ready. Refresh to update.',
  INSTALL_BENEFIT: 'Install Feasto for faster reordering, push alerts, and direct home screen access.',
  NOTIFICATIONS_EXPLAINER: 'Enable notifications to receive real-time order updates, rider tracking alerts, and customized offers.',
};

export const INSTALL_GUIDES = {
  ios: {
    title: 'Install Feasto on iOS',
    steps: [
      'Open Feasto in the Safari browser.',
      'Tap the "Share" button at the bottom of the screen (the box with an upward arrow).',
      'Scroll down and select "Add to Home Screen".',
      'Tap "Add" in the top-right corner to finish installation.',
    ],
  },
  chrome: {
    title: 'Install Feasto on Chrome / Android',
    steps: [
      'Tap the three-dot menu button in the browser address bar.',
      'Select "Install app" or "Add to Home Screen".',
      'Follow the prompt to complete the installation.',
    ],
  },
  safari_mac: {
    title: 'Install Feasto on macOS Safari',
    steps: [
      'Open the File menu in Safari.',
      'Select "Add to Dock...".',
      'Confirm the app name and click "Add".',
    ],
  },
};
