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
    <div className="w-80 border-r border-[#141518]/15 bg-[#FAF8F5] p-8 flex flex-col justify-between select-none text-left font-mono">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#141518] text-[#D7F04A] flex items-center justify-center font-black text-xs">
            FS
          </div>
          <div>
            <span className="font-heading font-black text-xs uppercase tracking-widest text-[#141518] block">
              FEASTO STUDIO
            </span>
            <span className="text-[9px] uppercase tracking-wider text-[#52555F] block">
              MERCHANT INITIALIZATION
            </span>
          </div>
        </div>

        {/* Vertical Steps List */}
        <nav className="space-y-4">
          {STEPS.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = completedSteps.includes(step.key);
            const isFuture = idx > currentStepIndex;

            return (
              <div
                key={step.key}
                className="flex gap-3 items-start transition-all duration-150"
              >
                {/* Visual Indicator */}
                <div
                  className={`w-6 h-6 border flex items-center justify-center shrink-0 text-[10px] font-bold transition-all duration-150 ${
                    isCompleted
                      ? 'bg-[#141518] border-[#141518] text-[#D7F04A]'
                      : isActive
                      ? 'border-[#141518] bg-[#D7F04A] text-[#141518] shadow-[2px_2px_0px_#141518]'
                      : 'border-[#141518]/20 text-[#52555F] bg-[#F3F0E8]'
                  }`}
                >
                  {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
                </div>

                {/* Text descriptors */}
                <div className="min-w-0">
                  <span
                    className={`text-xs block uppercase tracking-wider ${
                      isActive ? 'text-[#141518] font-black' : isFuture ? 'text-[#52555F]/60' : 'text-[#141518] font-bold'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#52555F] block mt-0.5 leading-none">
                    {step.sub}
                  </span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Help links footer */}
      <div className="text-[10px] text-[#52555F] font-bold space-y-1 border-t border-[#141518]/10 pt-4">
        <a href="#help" className="hover:text-[#141518] transition-colors block uppercase tracking-wider">
          Merchant Support FAQ
        </a>
        <span className="text-[9px] text-[#52555F]/70">PCI-DSS OPERATIONS V2.0</span>
      </div>
    </div>
  );
};

export default OnboardingSidebar;
