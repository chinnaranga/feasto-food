import React from "react";

const SkeletonCard = () => {
    return (
        <div className="bg-[#18181b] border border-white/5 rounded-3xl overflow-hidden h-full flex flex-col animate-pulse">
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-white/5" />

            {/* Content Skeleton */}
            <div className="p-5 flex-1 space-y-3">
                {/* Title & Badge */}
                <div className="flex justify-between items-start">
                    <div className="h-6 w-2/3 bg-white/5 rounded-md" />
                    <div className="h-5 w-16 bg-white/5 rounded-full" />
                </div>

                {/* Description lines */}
                <div className="space-y-2 pt-2">
                    <div className="h-4 w-full bg-white/5 rounded-md" />
                    <div className="h-4 w-3/4 bg-white/5 rounded-md" />
                </div>

                {/* Footer: Price & Button */}
                <div className="pt-4 mt-auto flex items-center justify-between">
                    <div className="h-6 w-20 bg-white/5 rounded-md" />
                    <div className="h-10 w-10 bg-white/5 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
