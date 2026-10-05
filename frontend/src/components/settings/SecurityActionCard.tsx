import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SecurityActionCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  statusText?: string;
  isStatusPositive?: boolean;
  icon?: React.ReactNode;
}

export const SecurityActionCard: React.FC<SecurityActionCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  statusText,
  isStatusPositive = true,
  icon,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-secondary-bg border border-border-main rounded-2xl text-left transition-main hover:border-brand-orange/20 shadow-soft">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-primary-bg rounded-xl text-text-secondary shadow-sm shrink-0">
          {icon || <ShieldCheck size={18} className="text-brand-orange" />}
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-sm text-text-primary tracking-tight">{title}</h3>
            {statusText && (
              <span
                className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide border
                  ${
                    isStatusPositive
                      ? 'bg-success-main/5 text-success-main border-success-main/10'
                      : 'bg-error-main/5 text-error-main border-error-main/10'
                  }`}
              >
                {statusText}
              </span>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed max-w-md">
            {description}
          </p>
        </div>
      </div>

      {actionLabel && onAction && (
        <Button
          variant="outline"
          size="sm"
          onClick={onAction}
          className="rounded-xl text-xs font-bold px-4 py-2 bg-primary-bg border border-border-main hover:bg-secondary-bg shrink-0 flex items-center gap-1"
        >
          <span>{actionLabel}</span>
          <ChevronRight size={12} />
        </Button>
      )}
    </div>
  );
};
