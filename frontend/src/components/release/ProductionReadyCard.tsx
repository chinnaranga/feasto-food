import React from 'react';
import { CheckCircle, Rocket } from 'lucide-react';
import { useBuildMetadata } from '../../hooks/release/useBuildMetadata';
import { useDeploymentStatus } from '../../hooks/release/useDeploymentStatus';
import { useEnvironmentReadiness } from '../../hooks/release/useEnvironmentReadiness';
import { releaseNotes } from '../../services/release/releaseNotes';

export const ProductionReadyCard: React.FC = () => {
  const { version } = useBuildMetadata();
  const { score } = useDeploymentStatus();
  const { isValid } = useEnvironmentReadiness();
  const notes = releaseNotes.getLatest();

  const isReady = isValid && score >= 80;

  return (
    <div className="bg-primary-bg border border-border-main rounded-2xl overflow-hidden">
      {/* Header */}
      <div className={`flex items-center gap-3 px-5 py-4 border-b border-border-main ${isReady ? 'bg-emerald-500/5' : 'bg-amber-500/5'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isReady ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`}>
          {isReady ? (
            <CheckCircle size={20} className="text-emerald-500" />
          ) : (
            <Rocket size={20} className="text-amber-500" />
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-text-primary">
            {isReady ? 'Production Ready' : 'Almost Ready'}
          </h3>
          <p className="text-xs text-text-secondary">
            {isReady
              ? `Feasto v${version} has passed all readiness gates.`
              : 'Some checks need attention before launch.'}
          </p>
        </div>
      </div>

      {/* Release Notes Preview */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h4 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wide">
            v{notes.version} Release Highlights
          </h4>
          <ul className="flex flex-col gap-1.5">
            {notes.changes.slice(0, 3).map((change, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle size={11} className="text-brand-orange mt-0.5 shrink-0" />
                <span className="text-[11px] text-text-secondary leading-snug">{change}</span>
              </li>
            ))}
          </ul>
        </div>
        {notes.security && notes.security.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-text-primary mb-2 uppercase tracking-wide">
              Security
            </h4>
            <ul className="flex flex-col gap-1.5">
              {notes.security.map((sec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle size={11} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-[11px] text-text-secondary leading-snug">{sec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProductionReadyCard;
