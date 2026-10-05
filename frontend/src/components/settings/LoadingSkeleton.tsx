import React from 'react';
import { Skeleton } from '@/components/common/Skeleton';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full text-left">
      {/* Settings Title Skeleton */}
      <div className="flex flex-col gap-2">
        <Skeleton variant="text" className="h-6 w-1/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>

      <div className="border border-border-main bg-primary-bg rounded-3xl p-6 flex flex-col gap-6 shadow-soft">
        {/* Settings Header Row Skeleton */}
        <div className="flex items-center justify-between pb-4 border-b border-border-main/50">
          <Skeleton variant="text" className="h-5 w-1/3" />
          <Skeleton variant="rectangular" className="h-8 w-20 rounded-xl" />
        </div>

        {/* Setting lines */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" className="h-4 w-1/4" />
              <Skeleton variant="text" className="h-3 w-3/4" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-11 rounded-full shrink-0" />
          </div>

          <div className="flex justify-between items-start gap-4 border-t border-border-main/50 pt-6">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" className="h-4 w-1/3" />
              <Skeleton variant="text" className="h-3 w-2/3" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-11 rounded-full shrink-0" />
          </div>

          <div className="flex justify-between items-start gap-4 border-t border-border-main/50 pt-6">
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton variant="text" className="h-4 w-1/5" />
              <Skeleton variant="text" className="h-3 w-1/2" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-11 rounded-full shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};
