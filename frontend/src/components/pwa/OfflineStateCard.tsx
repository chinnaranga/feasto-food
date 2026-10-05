import React, { useState } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface OfflineStateCardProps {
  onRetry?: () => void | Promise<void>;
  title?: string;
  description?: string;
}

export const OfflineStateCard: React.FC<OfflineStateCardProps> = ({
  onRetry,
  title = 'Connection Lost',
  description = 'You are currently offline. We couldn\'t load the latest content. Check your internet connection and try again.',
}) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) {
      setIsRetrying(true);
      // Simulate quick check
      setTimeout(() => {
        setIsRetrying(false);
        window.location.reload();
      }, 800);
      return;
    }

    try {
      setIsRetrying(true);
      await onRetry();
    } catch (e) {
      // Ignore retry errors
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[50vh] bg-primary-bg rounded-2xl border border-border-main shadow-sm max-w-md mx-auto my-8">
      {/* Icon Frame */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-error-main/10 text-error-main mb-6">
        <WifiOff size={32} />
      </div>

      {/* Headings */}
      <h3 className="text-xl font-bold text-text-primary mb-3 font-heading tracking-tight">
        {title}
      </h3>
      <p className="text-sm text-text-secondary mb-8 leading-relaxed">
        {description}
      </p>

      {/* Action CTA */}
      <Button
        variant="secondary"
        onClick={handleRetry}
        isLoading={isRetrying}
        className="w-full sm:w-auto min-w-[140px]"
      >
        {!isRetrying && <RefreshCw size={16} />}
        {isRetrying ? 'Checking...' : 'Try Reconnecting'}
      </Button>
    </div>
  );
};
