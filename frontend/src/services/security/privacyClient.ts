import { useSecurityStore } from '../../store/security/securityStore';

export const privacyClient = {
  // Simulate requesting a personal data download under GDPR/CCPA regulations
  requestDataExport: async (): Promise<{ requestId: string; etaHours: number }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = `exp-${Math.floor(100000 + Math.random() * 900000)}`;
        const store = useSecurityStore.getState();
        store.addSecurityEvent('consent', `Created Personal Data Export request: ${id}`);
        resolve({ requestId: id, etaHours: 24 });
      }, 600);
    });
  },

  // Request browser location usage permission
  requestLocationPermission: async (): Promise<boolean> => {
    const store = useSecurityStore.getState();
    try {
      if (!navigator.geolocation) {
        store.addSecurityEvent('consent', 'Location permission rejected: Geolocation unsupported by browser.');
        return false;
      }
      
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          () => {
            store.setPrivacyPreference('locationConsent', true);
            store.addSecurityEvent('consent', 'Location permission granted by browser.');
            resolve(true);
          },
          () => {
            store.setPrivacyPreference('locationConsent', false);
            store.addSecurityEvent('consent', 'Location permission denied by user.');
            resolve(false);
          }
        );
      });
    } catch (err) {
      return false;
    }
  },
};
