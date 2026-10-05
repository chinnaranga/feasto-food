import React from 'react';
import { Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';

export const ProfileCompletenessMeter: React.FC = () => {
  const { getCompleteness } = usePortalProfileStore();
  const { score, missing } = getCompleteness();

  const isComplete = score === 100;

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4 text-left select-none">
      
      {/* Score title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Award size={15} className={isComplete ? 'text-emerald-500' : 'text-[#e35205]'} />
          <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
            Profile Readiness
          </span>
        </div>
        <span className={`text-xs font-black ${isComplete ? 'text-emerald-600' : 'text-[#e35205]'}`}>
          {score}% Completed
        </span>
      </div>

      {/* Progress slider bar */}
      <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${isComplete ? 'bg-emerald-500' : 'bg-[#e35205]'}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Missing attributes checks list */}
      <div className="space-y-2 pt-1">
        {isComplete ? (
          <div className="flex gap-2 items-start text-[10px] leading-relaxed text-emerald-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
            <p>Your brand identity is completely verified. Your public profile is live on all food delivery search catalogs.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
              Remaining items to publish:
            </span>
            <ul className="space-y-1">
              {missing.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-medium">
                  <AlertCircle size={10} className="text-[#e35205] shrink-0" />
                  <span>Add {item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

    </div>
  );
};
export default ProfileCompletenessMeter;
