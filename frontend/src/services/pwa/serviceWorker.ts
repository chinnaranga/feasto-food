import { usePwaStore } from '../../store/pwa/pwaStore';

export const registerServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    // Register sw.js served from public root
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    usePwaStore.getState().setSwRegistration(registration);

    // 1. Check if there's already a waiting service worker (update ready)
    if (registration.waiting) {
      usePwaStore.getState().setUpdateAvailable(true);
    }

    // 2. Listen for new service worker installation events
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // New content is available; please refresh.
            usePwaStore.getState().setUpdateAvailable(true);
          }
        }
      });
    });

    // 3. Listen for navigate messages from the service worker (push notifications click)
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'NAVIGATE') {
        const url = event.data.url;
        // Perform router redirection or page navigation
        window.location.href = url;
      }
    });

    // 4. Periodically check for service worker updates (every hour)
    setInterval(() => {
      registration.update().catch(() => {});
    }, 60 * 60 * 1000);

  } catch (error) {
    // Quietly catch errors (e.g. localhost certificate issues, development environments)
  }
};

export const unregisterServiceWorker = async (): Promise<void> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
    usePwaStore.getState().setSwRegistration(null);
    usePwaStore.getState().setUpdateAvailable(false);
  } catch (error) {
    // Quietly handle errors
  }
};
