import { registerServiceWorker } from './serviceWorker';
import { initInstallPromptListener } from './installPrompt';
import { initNetworkStatusListener } from './networkStatus';

export * from './serviceWorker';
export * from './installPrompt';
export * from './networkStatus';
export * from './notificationReadiness';

/**
 * Initializes all Progressive Web App services:
 * 1. Registers the Service Worker.
 * 2. Binds listeners for native install prompts.
 * 3. Monitors network connection and latency profiles.
 */
export const initPwa = (): void => {
  if (typeof window === 'undefined') return;

  // Initialize service worker
  registerServiceWorker();

  // Initialize install event capture
  initInstallPromptListener();

  // Initialize network monitoring
  initNetworkStatusListener();
};
