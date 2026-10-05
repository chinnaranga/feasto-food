import React from 'react';
import { Gift, Coins } from 'lucide-react';
import { useRewardsBalance } from '@/hooks/loyalty/useRewardsBalance';
import { Button } from '@/components/ui/Button';

export const RewardsBalanceCard: React.FC = () => {
  const { points, credits, setModalOpen } = useRewardsBalance();

  return (
    <div className="p-6 bg-white border border-border-main rounded-3xl shadow-xs text-left flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Coins size={18} className="text-brand-orange" />
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Loyalty Ledger</h4>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
            Active
          </span>
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-black text-text-primary">{points}</span>
          <span className="text-xs font-semibold text-text-secondary">Points</span>
        </div>

        <p className="text-[11px] text-text-secondary font-medium leading-relaxed mb-4">
          Equivalent to <span className="font-extrabold text-text-primary">₹{credits}</span> in Feasto Credits, which can be applied directly on checkout.
        </p>
      </div>

      <div className="pt-4 border-t border-border-main/50 flex justify-end">
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          className="rounded-xl text-[10px] font-extrabold py-2 px-4 uppercase tracking-wider flex items-center gap-1.5"
          disabled={points < 100}
        >
          <Gift size={12} />
          <span>Redeem Points</span>
        </Button>
      </div>
    </div>
  );
};
