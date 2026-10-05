import React from 'react';
import { Flame } from 'lucide-react';
import { useLoyaltyStore } from '@/store/loyalty/loyaltyStore';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/store/toastStore';

export const StreakCard: React.FC = () => {
  const streak = useLoyaltyStore((state) => state.streakDays);
  const incrementStreak = useLoyaltyStore((state) => state.incrementStreak);
  const resetStreak = useLoyaltyStore((state) => state.resetStreak);
  const { addToast } = useToastStore();

  const handleIncrement = () => {
    incrementStreak();
    addToast({ message: `Order streak increased to ${streak + 1} days!`, type: 'success' });
  };

  return (
    <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50/50 border border-orange-200 rounded-3xl text-left flex flex-col justify-between h-full w-full">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-orange-500 fill-orange-500 animate-bounce" />
          <h3 className="text-sm font-extrabold text-orange-950 uppercase tracking-wider">Active Order Streak</h3>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-black text-orange-600">{streak}</span>
          <span className="text-xs font-semibold text-orange-950">Days Row</span>
        </div>

        <p className="text-xs text-orange-900 leading-relaxed mb-4">
          {streak >= 3
            ? "You've unlocked the 3-day Feast Master milestone! Keep ordering daily to unlock the 5-day milestone."
            : 'Order 3 days in a row to get a 50 bonus points reward. Streak resets if you miss a day.'}
        </p>
      </div>

      <div className="pt-4 border-t border-orange-200/50 flex gap-2 justify-end">
        <Button
          onClick={resetStreak}
          variant="ghost"
          className="rounded-xl text-[9px] font-extrabold px-3 py-1.5 border border-orange-200 text-orange-700 bg-white hover:bg-orange-100"
        >
          Reset Streak
        </Button>
        <Button
          onClick={handleIncrement}
          variant="primary"
          className="rounded-xl text-[9px] font-extrabold px-3.5 py-1.5 uppercase bg-orange-500 hover:bg-orange-600 border-none shadow-xs text-white"
        >
          Simulate Order
        </Button>
      </div>
    </div>
  );
};
