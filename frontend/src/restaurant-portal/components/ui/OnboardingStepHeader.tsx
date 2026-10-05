import React from 'react';

interface OnboardingStepHeaderProps {
  title: string;
  description: string;
}

export const OnboardingStepHeader: React.FC<OnboardingStepHeaderProps> = ({ title, description }) => {
  return (
    <div className="border-b border-neutral-100 pb-5 mb-6 text-left">
      <h2 className="text-base font-black text-neutral-900 tracking-tight">
        {title}
      </h2>
      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
export default OnboardingStepHeader;
