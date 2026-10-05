import React from 'react';
import { GitCommit, Clock, Tag, Radio } from 'lucide-react';
import { useBuildMetadata } from '../../hooks/release/useBuildMetadata';
import { useReleaseChannel } from '../../hooks/release/useReleaseChannel';

export const BuildInfoCard: React.FC = () => {
  const { version, buildTimestamp, commitHash } = useBuildMetadata();
  const { channel } = useReleaseChannel();

  const channelColors: Record<string, string> = {
    production: 'text-emerald-500 bg-emerald-500/8 border-emerald-500/20',
    staging: 'text-amber-500 bg-amber-500/8 border-amber-500/20',
    preview: 'text-violet-500 bg-violet-500/8 border-violet-500/20',
    development: 'text-sky-500 bg-sky-500/8 border-sky-500/20',
  };

  const formattedDate = new Date(buildTimestamp).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border-main bg-secondary-bg">
        <div className="flex items-center gap-2.5">
          <Tag size={15} className="text-brand-orange" />
          <h3 className="text-sm font-bold text-text-primary">Build Information</h3>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${channelColors[channel] ?? channelColors.development}`}>
          <Radio size={8} className="shrink-0" />
          {channel}
        </span>
      </div>

      {/* Details */}
      <dl className="divide-y divide-border-main/60">
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="flex items-center gap-2 text-xs text-text-secondary">
            <Tag size={12} className="text-text-muted" />
            Version
          </dt>
          <dd className="text-xs font-mono font-bold text-text-primary">v{version}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="flex items-center gap-2 text-xs text-text-secondary">
            <Clock size={12} className="text-text-muted" />
            Built At
          </dt>
          <dd className="text-xs font-mono text-text-secondary">{formattedDate}</dd>
        </div>
        <div className="flex items-center justify-between px-5 py-3">
          <dt className="flex items-center gap-2 text-xs text-text-secondary">
            <GitCommit size={12} className="text-text-muted" />
            Commit
          </dt>
          <dd className="text-[11px] font-mono text-text-muted">{commitHash.slice(0, 10)}…</dd>
        </div>
      </dl>
    </div>
  );
};
export default BuildInfoCard;
