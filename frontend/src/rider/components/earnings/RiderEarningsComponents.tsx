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
    completed: { label: '✓ COMPLETED', bg: 'bg-[#D7F04A] border-[#141518]', text: 'text-[#141518]' },
    processing: { label: '⏳ PROCESSING', bg: 'bg-[#FEF08A] border-[#141518]', text: 'text-[#141518]' },
    pending: { label: '● SCHEDULED', bg: 'bg-[#BFDBFE] border-[#141518]', text: 'text-[#141518]' },
    failed: { label: '⚠️ FAILED', bg: 'bg-[#FEE2E2] border-[#141518]', text: 'text-[#991B1B]' },
  };

  const curr = styles[status] || styles.completed;

  return (
    <span
      className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 border shadow-[1px_1px_0px_#141518] ${curr.bg} ${curr.text}`}
    >
      {curr.label}
    </span>
  );
};

// ─── EarningsSubNavTabBar ────────────────────────────────────────────────────
export const EarningsSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'TODAY', path: '/rider/earnings/today' },
    { label: 'WEEKLY', path: '/rider/earnings/weekly' },
    { label: 'MONTHLY', path: '/rider/earnings/monthly' },
    { label: 'PER-TRIP', path: '/rider/earnings/breakdown' },
    { label: 'WALLET HUB', path: '/rider/earnings/wallet' },
    { label: 'BANK PAYOUTS', path: '/rider/earnings/payouts' },
    { label: 'SURGE QUESTS', path: '/rider/earnings/bonuses' },
    { label: 'DEDUCTIONS', path: '/rider/earnings/deductions' },
    { label: 'TAX INVOICES', path: '/rider/earnings/statements' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/earnings/today' || tab.path === '/rider/earnings'}
            className={({ isActive }) =>
              `px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border transition-all ${
                isActive
                  ? 'bg-[#D7F04A] text-[#141518] border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#FAF8F5] border-transparent text-[#55565B] hover:text-[#141518] hover:bg-[#F3F0E8] hover:border-[#141518]/20'
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
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-left font-mono">
      <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-[#55565B] uppercase tracking-wider">
            AVAILABLE WALLET BALANCE
          </span>
          <h2 className="text-3xl font-black text-[#141518] font-mono leading-none mt-1">
            ₹{wallet.availableBalance.toFixed(2)}
          </h2>
        </div>

        <span className="text-[10px] font-mono font-black uppercase px-2.5 py-0.5 bg-[#D7F04A] text-[#141518] border border-[#141518]">
          READY FOR SETTLEMENT
        </span>
      </div>

      <div className="space-y-2 text-xs font-mono text-[#141518]">
        <div className="flex justify-between p-2.5 bg-[#F3F0E8] border border-[#141518]">
          <span className="text-[#55565B]">PENDING INCOMING CLEARANCE</span>
          <span className="font-bold">₹{wallet.pendingBalance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between p-2.5 bg-[#F3F0E8] border border-[#141518]">
          <span className="text-[#55565B]">DESTINATION BANK ACCOUNT</span>
          <span className="font-bold">{wallet.bankName} ({wallet.bankAccountMasked})</span>
        </div>
      </div>

      <RiderButton variant="primary" size="lg" fullWidth onClick={onOpenTransfer}>
        WITHDRAW DIRECT TO BANK ACCOUNT →
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
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer" />
      <div className="relative w-full max-w-sm bg-[#FAF8F5] border border-[#141518] p-6 shadow-[6px_6px_0px_#141518] space-y-4 text-left z-10 font-mono">
        <div className="flex items-center justify-between border-b border-[#141518]/15 pb-3">
          <h3 className="text-sm font-heading font-black text-[#141518] uppercase">
            CONFIRM INSTANT BANK WITHDRAWAL
          </h3>
          <button
            onClick={onClose}
            className="p-1 border border-[#141518] bg-[#FAF8F5] hover:bg-[#F3F0E8] text-[#141518]"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 bg-[#F3F0E8] border border-[#141518] space-y-2 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-[#55565B]">TRANSFER AMOUNT</span>
            <span className="font-black text-[#141518] text-sm">₹{wallet.availableBalance.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#55565B]">DESTINATION</span>
            <span className="font-bold text-[#141518]">{wallet.bankName} ({wallet.bankAccountMasked})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#55565B]">COMMISSION / FEE</span>
            <span className="font-black text-[#141518]">₹0.00 (FEASTO COVERED)</span>
          </div>
        </div>

        <p className="text-[11px] text-[#55565B] leading-relaxed font-sans">
          Funds are transferred via instant IMPS / UPI rail directly into your account in ~60 seconds.
        </p>

        <div className="pt-2 flex items-center gap-2">
          <RiderButton variant="outline" fullWidth onClick={onClose}>
            CANCEL
          </RiderButton>
          <RiderButton variant="primary" fullWidth onClick={onConfirmTransfer}>
            CONFIRM TRANSFER →
          </RiderButton>
        </div>
      </div>
    </div>
  );
};
