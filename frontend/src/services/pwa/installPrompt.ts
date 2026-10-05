import { usePwaStore } from '../../store/pwa/pwaStore';
import { BeforeInstallPromptEvent } from '../../types/pwa';

export const initInstallPromptListener = (): void => {
  if (typeof window === 'undefined') return;

  // Listen for the native beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the browser's default prompt mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Save the event in the Zustand store so we can trigger it later via custom CTA
    const event = e as BeforeInstallPromptEvent;
    usePwaStore.getState().setDeferredPrompt(event);
    usePwaStore.getState().setShowInstallPrompt(true);
  });

  // Listen for the native appinstalled event
  window.addEventListener('appinstalled', () => {
    // Clear the deferred prompt since installation succeeded
    usePwaStore.getState().setDeferredPrompt(null);
    usePwaStore.getState().setShowInstallPrompt(false);
  });
};
