import React from 'react';
import { Tag, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useReleaseStore } from '../../store/release/releaseStore';
import { useObservabilityStore } from '../../store/observability/observabilityStore';

export const ReleaseHealthCard: React.FC = () => {
  const { metadata, versionMismatch } = useReleaseStore();
  const events = useObservabilityStore((state) => state.events);

  const releaseEvents = events.filter((e) => e.category === 'release');
  const releaseWarnings = releaseEvents.filter((e) => e.severity === 'warn' || e.severity === 'fatal').length;

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border-main bg-secondary-bg flex items-center gap-2.5">
        <Tag size={15} className="text-brand-orange" />
        <h3 className="text-sm font-bold text-text-primary">Release Health</h3>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* Release Status */}
        <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl border border-border-main bg-secondary-bg">
          <div className="flex gap-2.5 items-center">
            {versionMismatch ? (
              <AlertOctagon className="text-red-500 shrink-0" size={18} />
            ) : (
              <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
            )}
            <div>
              <span className="text-xs font-bold text-text-primary block">
                {versionMismatch ? 'Outdated Version Detected' : 'Client Version Up-to-Date'}
              </span>
              <p className="text-[10px] text-text-muted">
                Channel: <span className="font-mono">{metadata.buildChannel}</span> · v{metadata.version}
              </p>
            </div>
          </div>
        </div>

        {/* Status Metrics */}
        <div className="divide-y divide-border-main/50">
          <div className="flex justify-between py-2 text-xs">
            <span className="text-text-secondary">Version Warnings Count</span>
            <span className={`font-semibold ${releaseWarnings > 0 ? 'text-amber-500' : 'text-text-primary'}`}>
              {releaseWarnings}
            </span>
          </div>

          <div className="flex justify-between py-2 text-xs">
            <span className="text-text-secondary">Git Hash Trace</span>
            <span className="font-mono text-[10px] text-text-muted">
              {metadata.commitHash.slice(0, 12)}
            </span>
          </div>

          <div className="flex justify-between py-2 text-xs">
            <span className="text-text-secondary">Release Events Registered</span>
            <span className="font-semibold text-text-primary">
              {releaseEvents.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReleaseHealthCard;
