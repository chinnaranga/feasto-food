import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, HelpCircle } from 'lucide-react';
import { useRewardsBalance } from '@/hooks/loyalty/useRewardsBalance';
import { useToastStore } from '@/store/toastStore';
import { Button } from '@/components/ui/Button';

export const RedemptionModal: React.FC = () => {
  const { points, isModalOpen, setModalOpen, redeem } = useRewardsBalance();
  const { addToast } = useToastStore();
  const [selectedPoints, setSelectedPoints] = useState<number>(100);

  if (!isModalOpen) return null;

  const handleRedeem = () => {
    const res = redeem(selectedPoints);
    if (res.success) {
      addToast({ message: res.message, type: 'success' });
      setModalOpen(false);
    } else {
      addToast({ message: res.message, type: 'error' });
    }
  };

  const options = [100, 200, 500];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setModalOpen(false)}
          className="absolute inset-0 bg-black/30 backdrop-blur-xs"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-sm bg-white border border-border-main rounded-3xl p-6 shadow-soft text-left overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 hover:bg-secondary-bg/50 rounded-lg transition-main cursor-pointer text-text-muted hover:text-text-primary"
            aria-label="Close redemption modal"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-brand-orange animate-pulse" />
            <h3 className="text-sm font-extrabold text-text-primary uppercase tracking-wider">Redeem Rewards Points</h3>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed mb-5">
            Convert your loyalty reward points into Feasto Credits instantly. 10 points convert to ₹1 cashback credit to use at checkout.
          </p>

          <div className="mb-6">
            <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block mb-2">Select conversion option</span>
            <div className="grid grid-cols-3 gap-3">
              {options.map((opt) => {
                const isPossible = points >= opt;
                const isSelected = selectedPoints === opt;

                return (
                  <button
                    key={opt}
                    disabled={!isPossible}
                    onClick={() => setSelectedPoints(opt)}
                    className={`p-3 border rounded-2xl flex flex-col items-center gap-1 transition-main cursor-pointer
                      ${isSelected
                        ? 'border-brand-orange bg-brand-orange/[0.02] text-brand-orange'
                        : isPossible
                          ? 'border-border-main hover:border-text-secondary/40 text-text-primary bg-white'
                          : 'border-border-main/50 opacity-40 bg-secondary-bg text-text-muted cursor-not-allowed'
                      }`}
                  >
                    <span className="text-xs font-black">{opt} pts</span>
                    <span className="text-[9px] font-bold text-text-muted">₹{opt / 10} credit</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-secondary-bg/30 border border-border-main/40 rounded-2xl mb-6 flex items-start gap-2.5">
            <HelpCircle size={14} className="text-text-muted shrink-0 mt-0.5" />
            <p className="text-[10px] text-text-secondary leading-relaxed font-medium">
              You currently have <span className="font-extrabold text-text-primary">{points} points</span>. Redeeming <span className="font-extrabold text-text-primary">{selectedPoints} points</span> will convert to <span className="font-extrabold text-emerald-600">₹{selectedPoints / 10} credits</span>.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border-main/50">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              className="rounded-xl text-xs font-bold px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleRedeem}
              className="rounded-xl text-xs font-bold px-4 py-2 bg-brand-orange hover:bg-brand-orange-dark border-none"
            >
              Redeem Credits
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
