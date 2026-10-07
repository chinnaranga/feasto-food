import React from 'react';
import { Award, AlertCircle, CheckCircle2 } from 'lucide-react';
import { usePortalProfileStore } from '../../store/portalProfileStore';

export const ProfileCompletenessMeter: React.FC = () => {
  const { getCompleteness } = usePortalProfileStore();
  const { score, missing } = getCompleteness();

  const isComplete = score === 100;

  return (
    <div className="bg-[#FAF8F5] border border-[#141518]/20 p-5 shadow-[4px_4px_0px_#141518] space-y-4 text-left select-none font-mono">
      {/* Score title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Award size={15} className={isComplete ? 'text-[#15803D]' : 'text-[#1B3BFF]'} />
          <span className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">
            Brand Readiness
          </span>
        </div>
        <span className={`text-xs font-black ${isComplete ? 'text-[#15803D]' : 'text-[#1B3BFF]'}`}>
          {score}% READY
        </span>
      </div>

      {/* Progress slider bar */}
      <div className="h-2 w-full bg-[#E2DED4] overflow-hidden border border-[#141518]/10">
        <div
          className={`h-full transition-all duration-300 ${isComplete ? 'bg-[#15803D]' : 'bg-[#141518]'}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Missing attributes checks list */}
      <div className="space-y-2 pt-1">
        {isComplete ? (
          <div className="flex gap-2 items-start text-[10px] leading-relaxed text-[#15803D] bg-emerald-50/70 p-3 border border-emerald-200">
            <CheckCircle2 size={13} className="text-[#15803D] shrink-0 mt-0.5" />
            <p>Brand identity is completely verified. Your public profile is live across Feasto consumer search directories.</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-wider block">
              Pending items to verify:
            </span>
            <ul className="space-y-1">
              {missing.map((item) => (
                <li key={item} className="flex items-center gap-1.5 text-[10px] text-[#52555F] font-bold">
                  <AlertCircle size={11} className="text-[#1B3BFF] shrink-0" />
                  <span>Configure {item}</span>
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
