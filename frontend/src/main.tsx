import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { initPwa } from './services/pwa';
import { useI18nStore } from './store/i18n/i18nStore';
import { useAuthStore } from './store/authStore';

// Initialize PWA configurations, network monitoring, and Service Worker
initPwa();

// Global error handler — catches failed dynamic chunk imports (e.g. after a new deployment)
// and surfaces the UpdateRecoveryDialog instead of a blank screen.
window.addEventListener('error', (event) => {
  const msg = event.message ?? '';
  if (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('error loading dynamically imported module')
  ) {
    import('./services/observability').then(({ observabilityClient }) => {
      observabilityClient.captureError(
        event.error || msg,
        'release',
        { severity: 'fatal', recoveryState: { recoveryTriggered: true, recoveryAction: 'reload-recovery-dialog' } }
      );
    });

    // Lazy import to avoid circular deps at module init time
    import('./store/release/releaseStore').then(({ useReleaseStore }) => {
      useReleaseStore.getState().triggerRecoveryDialog(
        'A new version of Feasto was deployed. Clearing old cached assets and reloading…'
      );
    });
  }
});

// Restore persisted directionality and language tags to document on launch
const { language, dir } = useI18nStore.getState();
document.documentElement.dir = dir;
document.documentElement.lang = language;

// ─── F1 — Persistent Session Bootstrap ─────────────────────────────────────────
//
// Automatically restores persisted session from localStorage via Zustand persist.
// Validates and refreshes backend JWT tokens silently in the background so users
// remain signed in across page reloads without flicker or unexpected sign-outs.
//
useAuthStore.getState().initializeSession();

// ─── Render ───────────────────────────────────────────────────────────────────
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
