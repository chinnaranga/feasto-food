import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ErrorBoundary } from '@/app/providers/ErrorBoundary';
import { ToastContainer } from '@/components/ui/Toast';
import { router } from '@/app/router';
import { useSettingsStore } from '@/store/settingsStore';
import { useReleaseStore } from '@/store/release/releaseStore';
import { VersionMismatchBanner } from '@/components/release/VersionMismatchBanner';
import { UpdateRecoveryDialog } from '@/components/release/UpdateRecoveryDialog';
import { EnvironmentWarningCard } from '@/components/release/EnvironmentWarningCard';
import { PreviewEnvironmentBadge } from '@/components/release/PreviewEnvironmentBadge';
import { useErrorTelemetry } from '@/hooks/observability/useErrorTelemetry';
import { useReleaseHealth } from '@/hooks/observability/useReleaseHealth';
import { ErrorTelemetryBanner } from '@/components/observability/ErrorTelemetryBanner';
import '@/styles/globals.css';

export default function App() {
  const accessibility = useSettingsStore((state) => state.accessibility);
  const motionPreference = accessibility.reducedMotion ? 'always' : 'never';
  const initializeReleaseStore = useReleaseStore((state) => state.initializeReleaseStore);

  // Initialize Observability Monitoring Hooks
  useErrorTelemetry();
  useReleaseHealth();

  useEffect(() => {
    initializeReleaseStore();
  }, [initializeReleaseStore]);

  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider>
          <MotionConfig reducedMotion={motionPreference}>
            <RouterProvider router={router} />
            <ToastContainer />
            {/* Release Engineering Overlays */}
            <VersionMismatchBanner />
            <UpdateRecoveryDialog />
            <EnvironmentWarningCard />
            <PreviewEnvironmentBadge />

            {/* Observability Overlays */}
            <ErrorTelemetryBanner />
          </MotionConfig>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}
