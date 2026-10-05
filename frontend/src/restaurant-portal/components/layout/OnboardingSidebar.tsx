import React from 'react';
import { Check } from 'lucide-react';

export interface OnboardingStepNode {
  key: string;
  label: string;
  sub: string;
}

export const STEPS: OnboardingStepNode[] = [
  { key: 'welcome', label: 'Welcome', sub: 'Setup overview' },
  { key: 'workspace', label: 'Workspace', sub: 'Region & Currency' },
  { key: 'profile', label: 'Profile details', sub: 'Cuisine & Contacts' },
  { key: 'business', label: 'Business info', sub: 'Legal name & Tax ID' },
  { key: 'operations', label: 'Preferences', sub: 'Schedules & Toggles' },
  { key: 'team', label: 'Team setup', sub: 'Invite members' },
  { key: 'review', label: 'Review details', sub: 'Confirm summaries' },
];

interface OnboardingSidebarProps {
  currentStepIndex: number;
  completedSteps: string[];
}

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  currentStepIndex,
  completedSteps,
}) => {
  return (
    <div className="w-80 border-r border-neutral-200 bg-neutral-50/50 p-8 flex flex-col justify-between select-none text-left">
      <div className="space-y-8">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#e35205] flex items-center justify-center text-white font-black text-[10px]">
            F
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800">
            Feasto Merchant Setup
          </span>
        </div>

        {/* Vertical Steps List */}
        <nav className="space-y-5">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = completedSteps.includes(step.key);
            const isFuture = idx > currentStepIndex;

            return (
              <div
                key={step.key}
                className={`flex gap-3 items-start transition-all duration-200`}
              >
                {/* Visual Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-200 ${
                    isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                      : isActive
                      ? 'border-[#e35205] bg-[#e35205]/5 text-[#e35205] shadow-[0_0_0_2px_rgba(227,82,5,0.15)]'
                      : 'border-neutral-200 text-neutral-400 bg-white'
                  }`}
                >
                  {isCompleted ? <Check size={11} strokeWidth={3} /> : idx + 1}
                </div>

                {/* Text descriptors */}
                <div className="min-w-0">
                  <span
                    className={`text-xs font-bold block transition-main ${
                      isActive ? 'text-neutral-900 font-extrabold' : isFuture ? 'text-neutral-400' : 'text-neutral-700'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5 leading-none">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Help links footer */}
      <div className="text-[10px] text-neutral-400 font-bold space-y-1">
        <a href="#help" className="hover:text-neutral-600 transition-main block">Merchant Support FAQ</a>
        <span>PCI-DSS Operations v1.0</span>
      </div>
    </div>
  );
};
export default OnboardingSidebar;
