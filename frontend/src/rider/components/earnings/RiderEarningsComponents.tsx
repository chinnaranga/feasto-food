import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Wallet,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Award,
  Download,
  AlertCircle,
  X,
  CreditCard,
  Building2,
} from 'lucide-react';
import type {
  EarningsSummary,
  TripEarningsBreakdown,
  RiderWalletState,
  PayoutRecord,
  QuestBonusItem,
  DeductionItem,
} from '../../types/earnings';
import { RiderButton } from '../RiderUIComponents';

// ─── PayoutStatusBadge ───────────────────────────────────────────────────────
export const PayoutStatusBadge: React.FC<{ status: PayoutRecord['status'] }> = ({ status }) => {
  const styles: Record<PayoutRecord['status'], { label: string; bg: string; text: string }> = {
    completed: { label: '✓ Completed', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    processing: { label: '⏳ Processing', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    pending: { label: '● Scheduled', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
    failed: { label: '⚠️ Failed', bg: 'bg-red-50 border-red-200', text: 'text-red-700' },
  };

  const curr = styles[status] || styles.completed;

  return (
    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${curr.bg} ${curr.text}`}>
      {curr.label}
    </span>
  );
};

// ─── EarningsSubNavTabBar ────────────────────────────────────────────────────
export const EarningsSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Today', path: '/rider/earnings/today' },
    { label: 'Weekly', path: '/rider/earnings/weekly' },
    { label: 'Monthly', path: '/rider/earnings/monthly' },
    { label: 'Per-Trip Breakdown', path: '/rider/earnings/breakdown' },
    { label: 'Rider Wallet', path: '/rider/earnings/wallet' },
    { label: 'Bank Payouts', path: '/rider/earnings/payouts' },
    { label: 'Quests & Bonuses', path: '/rider/earnings/bonuses' },
    { label: 'Deductions Audit', path: '/rider/earnings/deductions' },
    { label: 'Tax Statements', path: '/rider/earnings/statements' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/earnings/today' || tab.path === '/rider/earnings'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

// ─── WalletCard ──────────────────────────────────────────────────────────────
export const WalletCard: React.FC<{
  wallet: RiderWalletState;
  onOpenTransfer: () => void;
}> = ({ wallet, onOpenTransfer }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Available Wallet Balance</span>
          <h2 className="text-2xl font-black text-emerald-700 font-mono leading-none mt-1">
            ₹{wallet.availableBalance.toFixed(2)}
          </h2>
        </div>

        <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Ready for Payout
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono text-neutral-600">
        <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span>Pending Settlement Balance</span>
          <span className="font-bold text-neutral-900">₹{wallet.pendingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span>Linked Payout Bank Account</span>
          <span className="font-bold text-neutral-900">{wallet.bankName} ({wallet.bankAccountMasked})</span>
        </div>
      </div>

      <RiderButton variant="primary" size="lg" fullWidth onClick={onOpenTransfer}>
        Withdraw to Bank Account →
      </RiderButton>
    </div>
  );
};

// ─── InstantTransferModal ────────────────────────────────────────────────────
export const InstantTransferModal: React.FC<{
  isOpen: boolean;
  wallet: RiderWalletState;
  onClose: () => void;
  onConfirmTransfer: () => void;
}> = ({ isOpen, wallet, onClose, onConfirmTransfer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-modal space-y-4 text-left z-10">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
          <h3 className="text-sm font-black text-neutral-900 font-heading">Confirm Instant Payout Transfer</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400">
            <X size={16} />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-150 space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-neutral-500">Transfer Amount</span>
            <span className="font-bold text-emerald-700 text-sm">₹{wallet.availableBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Destination Account</span>
            <span className="font-bold text-neutral-900">{wallet.bankName} ({wallet.bankAccountMasked})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Processing Fee</span>
            <span className="font-bold text-emerald-700">₹0.00 (Zero Fee)</span>
          </div>
        </div>

        <p className="text-[11px] text-neutral-500 leading-relaxed">
          Funds will be deposited directly to your bank account via instant IMPS transfer within 60 seconds.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            Cancel
          </RiderButton>
          <RiderButton variant="primary" fullWidth onClick={onConfirmTransfer}>
            Confirm Payout Transfer
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
