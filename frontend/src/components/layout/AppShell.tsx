import React, { Suspense, useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Loading } from '@/pages/Loading';
import { FeastoFloatingNav } from '../navigation/FeastoFloatingNav';
import { FeastoCommandCanvas } from '../canvas/FeastoCommandCanvas';
import { FloatingCartObject } from '../cart/FloatingCartObject';
import { EditorialColophon } from './EditorialColophon';
import { useTrackRoutePageView } from '@/hooks/analytics/useTrackPageView';
import { useRouteHealth } from '@/hooks/observability/useRouteHealth';
import { RouteHealthIndicator } from '@/components/observability/RouteHealthIndicator';
import { OfflineBanner } from '../pwa/OfflineBanner';
import { UpdateAvailableBanner } from '../pwa/UpdateAvailableBanner';
import { InstallPromptBanner } from '../pwa/InstallPromptBanner';
import { AppInstallGuideModal } from '../pwa/AppInstallGuideModal';
import { SessionStatusBanner } from '../security/SessionStatusBanner';
import { IdleTimeoutModal } from '../security/IdleTimeoutModal';
import { SensitiveActionDialog } from '../security/SensitiveActionDialog';
import { ConsentBanner } from '../security/ConsentBanner';
import { PrivacyPreferencesDialog } from '../security/PrivacyPreferencesDialog';
import { ConsentConfirmationToast } from '../security/ConsentConfirmationToast';
import { ReauthPromptCard } from '../security/ReauthPromptCard';

import { GlobalFeastoAI } from '../ai/GlobalFeastoAI';

export const AppShell: React.FC = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Track page views automatically on route transitions
  useTrackRoutePageView();
  useRouteHealth();

  // Global ⌘K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F0E8] text-[#141518] selection:bg-[#D7F04A] selection:text-[#141518]">
      <RouteHealthIndicator />

      {/* Global PWA Layer */}
      <OfflineBanner />
      <UpdateAvailableBanner />
      <InstallPromptBanner />
      <AppInstallGuideModal />

      {/* Global Security & Compliance Layer */}
      <SessionStatusBanner />
      <IdleTimeoutModal />
      <SensitiveActionDialog />
      <ConsentBanner />
      <PrivacyPreferencesDialog />
      <ConsentConfirmationToast />
      <ReauthPromptCard />

      {/* Feasto Canvas Floating Contextual Navigation */}
      <FeastoFloatingNav onOpenCommand={() => setIsCommandOpen(true)} />

      {/* Universal ⌘K Command Canvas */}
      <FeastoCommandCanvas
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

      {/* Main Experience Canvas */}
      <main className="flex-grow">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Floating Cart Object (Discreet architectural beacon) */}
      <FloatingCartObject />

      {/* Global Autonomous Culinary AI Companion (NVIDIA Nemotron 3 Ultra) */}
      <GlobalFeastoAI />

      {/* Editorial Colophon */}
      <EditorialColophon />
    </div>
  );
};
