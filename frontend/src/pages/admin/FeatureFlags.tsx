import React from 'react';
import { ToggleLeft, ToggleRight, ShieldAlert, Sparkles, Sliders } from 'lucide-react';
import useAdminStore from '../../store/admin/adminStore';
import { FeatureFlagCard } from './components/AdminComponents';

export const FeatureFlags: React.FC = () => {
  const { featureFlags, toggleFeatureFlag, setRolloutPercentage } = useAdminStore();

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              ● Feature Rollout & Emergency Kill Switches
            </span>
            <span className="text-xs text-neutral-400 font-bold">Platform Governance Engine</span>
          </div>
          <h2 className="text-lg font-black text-neutral-900">
            Global Feature Flags & Progressive Rollouts
          </h2>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Safely enable new platform features, configure percentage rollouts across merchant branches, and trigger emergency kill switches during incidents.
          </p>
        </div>
      </div>

      {/* Feature Flag Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureFlags.map((flag) => (
          <FeatureFlagCard
            key={flag.key}
            flag={flag}
            onToggle={toggleFeatureFlag}
            onRolloutChange={setRolloutPercentage}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureFlags;
