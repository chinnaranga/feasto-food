import React from 'react';
import { PersonalizedSectionHeader } from './PersonalizedSectionHeader';

interface RecommendationRailProps {
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  children: React.ReactNode;
  onInfoClick?: () => void;
}

export const RecommendationRail: React.FC<RecommendationRailProps> = ({
  title,
  subtitle,
  isLoading,
  children,
  onInfoClick,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full text-left">
      <PersonalizedSectionHeader title={title} subtitle={subtitle} onInfoClick={onInfoClick} />
      
      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none select-none">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-4 bg-primary-bg border border-border-main rounded-2xl w-[240px] shrink-0 h-[190px] animate-pulse"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-4 w-20 bg-secondary-bg rounded-md" />
                </div>
                <div className="flex items-start gap-2.5 mb-2.5">
                  <div className="w-10 h-10 bg-secondary-bg rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-secondary-bg rounded-md w-3/4" />
                    <div className="h-2 bg-secondary-bg rounded-md w-1/2" />
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                  <div className="h-2 bg-secondary-bg rounded-md w-full" />
                  <div className="h-2 bg-secondary-bg rounded-md w-5/6" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-border-main/30">
                <div className="h-3 w-10 bg-secondary-bg rounded-md" />
                <div className="h-6 w-16 bg-secondary-bg rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {children}
        </div>
      )}
    </div>
  );
};
