import React from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '../ui/Button';

export interface AccessDeniedCardProps {
  requiredPermission?: string;
  onBack?: () => void;
  className?: string;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  requiredPermission,
  onBack,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-primary-bg rounded-2xl border border-border-main shadow-xs max-w-md mx-auto my-6 select-none ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-error-main/10 text-error-main mb-5">
        <ShieldX size={24} />
      </div>
      
      <h3 className="text-sm font-extrabold text-text-primary mb-1.5 font-heading tracking-tight">
        Access Denied
      </h3>
      <p className="text-[11px] text-text-secondary leading-relaxed mb-6">
        You do not have the required administrative permission {requiredPermission ? <code className="px-1.5 py-0.5 rounded bg-surface-bg border border-border-main font-mono text-[9px] font-bold text-error-main">"{requiredPermission}"</code> : ''} to view this component.
      </p>

      {onBack && (
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-xs font-bold px-4 py-1.5"
        >
          Return to Dashboard
        </Button>
      )}
    </div>
  );
};
export default AccessDeniedCard;
