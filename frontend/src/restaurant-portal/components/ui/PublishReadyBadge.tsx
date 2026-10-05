import React from 'react';
import { CheckCircle2, Clock, Globe } from 'lucide-react';

type PublishStatus = 'draft' | 'ready' | 'live';

interface PublishReadyBadgeProps {
  status: PublishStatus;
  className?: string;
}

const BADGE_CONFIG: Record<PublishStatus, {
  label: string;
  icon: React.ReactNode;
  className: string;
}> = {
  draft: {
    label: 'Draft',
    icon: <Clock size={10} />,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  ready: {
    label: 'Ready to Publish',
    icon: <CheckCircle2 size={10} />,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  live: {
    label: 'Live',
    icon: <Globe size={10} />,
    className: 'bg-sky-50 text-sky-700 border-sky-200',
  },
};

export const PublishReadyBadge: React.FC<PublishReadyBadgeProps> = ({ status, className = '' }) => {
  const config = BADGE_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider select-none ${config.className} ${className}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

export default PublishReadyBadge;
