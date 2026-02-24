export default function SkeletonCard() {
    return (
        <div className="animate-pulse rounded-2xl bg-white/5 border border-white/5 p-4 space-y-3">
            <div className="h-40 bg-white/10 rounded-xl w-full mb-4" />
            <div className="h-4 bg-white/10 rounded w-3/4" />
            <div className="h-3 bg-white/10 rounded w-1/2" />
            <div className="flex justify-between items-center mt-4">
                <div className="h-6 bg-white/10 rounded w-1/4" />
                <div className="h-8 w-8 rounded-full bg-white/10" />
            </div>
        </div>
    );
}
