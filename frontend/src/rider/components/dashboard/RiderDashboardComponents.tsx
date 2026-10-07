import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Power,
  MapPin,
  Clock,
  Wallet,
  ShoppingBag,
  Navigation,
  Bell,
  HelpCircle,
  User,
  Settings,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import type {
  RiderDutyState,
  DailyOperationalSummary,
  OperationalAlert,
  TodayShiftSchedule,
  RiderActivityItem,
} from '../../types/dashboard';
import { RiderButton } from '../RiderUIComponents';

// ─── DashboardTopBar ─────────────────────────────────────────────────────────
export const DashboardTopBar: React.FC<{
  dutyState: RiderDutyState;
  assignedZone: string;
  unreadAlertsCount: number;
  onToggleDuty: () => void;
  onOpenDrawer: () => void;
}> = ({ dutyState, assignedZone, unreadAlertsCount, onToggleDuty, onOpenDrawer }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 w-full bg-[#FAF8F5] border-b border-[#141518] z-[400] px-4 py-3 select-none">
      <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Menu Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenDrawer}
            className="p-1.5 bg-[#FAF8F5] border border-[#141518] text-[#141518] hover:bg-[#F3F0E8] shadow-[2px_2px_0px_#141518] cursor-pointer"
            aria-label="Open drawer"
          >
            <span className="text-base font-mono">☰</span>
          </button>

          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/rider/dashboard')}
          >
            <div className="w-6 h-6 bg-[#141518] text-[#D7F04A] border border-[#141518] flex items-center justify-center font-mono font-black text-[10px]">
              FC
            </div>
            <span className="text-xs font-mono font-black uppercase tracking-wider text-[#141518]">
              FEASTO RIDER
            </span>
            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-[#F3F0E8] text-[#141518] border border-[#141518]">
              RDR-8802
            </span>
          </div>
        </div>

        {/* Right: Duty Switcher & Alerts Bell */}
        <div className="flex items-center gap-2 font-mono">
          <button
            onClick={onToggleDuty}
            className={`px-3 py-1.5 text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer border border-[#141518] flex items-center gap-1.5 shadow-[2px_2px_0px_#141518] ${
              dutyState === 'online'
                ? 'bg-[#D7F04A] text-[#141518]'
                : dutyState === 'break_mode'
                ? 'bg-[#FEF08A] text-[#141518]'
                : 'bg-[#F3F0E8] text-[#55565B]'
            }`}
          >
            <Power size={12} />
            <span>{dutyState === 'online' ? 'ON DUTY' : dutyState === 'break_mode' ? 'PAUSED' : 'STANDBY'}</span>
          </button>

          <button
            onClick={() => navigate('/rider/alerts')}
            className="p-1.5 bg-[#FAF8F5] border border-[#141518] text-[#141518] hover:bg-[#F3F0E8] relative shadow-[2px_2px_0px_#141518] cursor-pointer"
            aria-label="Alerts"
          >
            <Bell size={16} />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D7F04A] border border-[#141518]" />
            )}
          </button>
        </div>
      </div>

      {/* Zone Sub-Banner */}
      <div className="max-w-xl mx-auto pt-2 flex items-center justify-between text-[11px] text-[#55565B] font-mono">
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-[#141518]" />
          <span>
            SECTOR: <strong className="text-[#141518] uppercase">{assignedZone}</strong>
          </span>
        </div>
        <span className="text-[#141518] font-mono font-bold">★ 4.92 SLA</span>
      </div>
    </header>
  );
};

// ─── DashboardSubNavTabBar ───────────────────────────────────────────────────
export const DashboardSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'CONTROL', path: '/rider/dashboard' },
    { label: 'SHIFT', path: '/rider/today' },
    { label: 'ALERTS', path: '/rider/alerts' },
    { label: 'SUMMARY', path: '/rider/summary' },
    { label: 'OVERVIEW', path: '/rider/overview' },
  ];

  return (
    <div className="w-full bg-[#FAF8F5] border-y border-[#141518] px-2 py-2 overflow-x-auto scrollbar-none text-left select-none font-mono">
      <div className="flex items-center gap-1.5 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/dashboard'}
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

// ─── StatusToggleCard ────────────────────────────────────────────────────────
export const StatusToggleCard: React.FC<{
  dutyState: RiderDutyState;
  assignedZone: string;
  onToggle: () => void;
  onToggleBreak: () => void;
}> = ({ dutyState, assignedZone, onToggle, onToggleBreak }) => {
  return (
    <div className="p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-[#55565B] uppercase tracking-wider">
            OPERATIONAL READINESS
          </span>
          <h3 className="text-base font-heading font-black text-[#141518] uppercase tracking-tight">
            {dutyState === 'online'
              ? 'ACTIVE ON DUTY'
              : dutyState === 'break_mode'
              ? 'SHIFT PAUSED (BREAK)'
              : 'VESSEL STANDBY (OFF)'}
          </h3>
        </div>

        <span
          className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 border shadow-[1px_1px_0px_#141518] ${
            dutyState === 'online'
              ? 'bg-[#D7F04A] text-[#141518] border-[#141518]'
              : dutyState === 'break_mode'
              ? 'bg-[#FEF08A] text-[#141518] border-[#141518]'
              : 'bg-[#F3F0E8] text-[#55565B] border-[#141518]/30'
          }`}
        >
          {dutyState === 'online' ? '● ON DUTY' : dutyState === 'break_mode' ? '⏸ PAUSED' : '○ STANDBY'}
        </span>
      </div>

      <p className="text-xs text-[#55565B] leading-relaxed font-sans">
        {dutyState === 'online'
          ? `Radar GPS active. Receiving priority delivery dispatches in ${assignedZone}.`
          : dutyState === 'break_mode'
          ? 'Dispatch queue paused. Tap resume when ready to accept orders.'
          : 'Turn On Duty to begin receiving high-ticket delivery offers in your zone.'}
      </p>

      <div className="grid grid-cols-2 gap-2.5">
        <RiderButton
          variant={dutyState === 'online' ? 'outline' : 'primary'}
          size="md"
          fullWidth
          onClick={onToggle}
        >
          {dutyState === 'online' ? 'GO OFF DUTY' : 'GO ON DUTY NOW'}
        </RiderButton>

        <RiderButton
          variant={dutyState === 'break_mode' ? 'primary' : 'outline'}
          size="md"
          fullWidth
          onClick={onToggleBreak}
        >
          {dutyState === 'break_mode' ? 'RESUME DELIVERIES' : 'BREAK (PAUSE)'}
        </RiderButton>
      </div>
    </div>
  );
};

// ─── DailySummaryCard ────────────────────────────────────────────────────────
export const DailySummaryCard: React.FC<{ summary: DailyOperationalSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2">
        <div className="flex items-center justify-between text-[#55565B]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">TODAY REVENUE</span>
          <div className="p-1 bg-[#D7F04A] border border-[#141518] text-[#141518]">
            <Wallet size={14} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-[#141518] font-mono leading-none">
            ₹{summary.todayEarnings.toFixed(0)}
          </h4>
          <span className="text-[11px] text-[#55565B] block font-mono mt-1">₹{summary.todayTips} tips</span>
        </div>
      </div>

      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2">
        <div className="flex items-center justify-between text-[#55565B]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">ORDERS COMPLETED</span>
          <div className="p-1 bg-[#F3F0E8] border border-[#141518] text-[#141518]">
            <TrendingUp size={14} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-[#141518] font-mono leading-none">
            {summary.todayTrips} DROPS
          </h4>
          <span className="text-[11px] text-[#141518] font-mono font-bold block mt-1">
            {summary.acceptanceRatePct}% SLA
          </span>
        </div>
      </div>

      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2">
        <div className="flex items-center justify-between text-[#55565B]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">ACTIVE SHIFT</span>
          <div className="p-1 bg-[#F3F0E8] border border-[#141518] text-[#141518]">
            <Clock size={14} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-[#141518] font-mono leading-none">
            5.8 HRS
          </h4>
          <span className="text-[11px] text-[#55565B] font-mono block mt-1">94% ON-TIME</span>
        </div>
      </div>

      <div className="p-4 bg-[#FAF8F5] border border-[#141518] shadow-[3px_3px_0px_#141518] space-y-2">
        <div className="flex items-center justify-between text-[#55565B]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider">PARTNER SLA</span>
          <div className="p-1 bg-[#D7F04A] border border-[#141518] text-[#141518]">
            <Award size={14} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-[#141518] font-mono leading-none">
            ★ 4.92
          </h4>
          <span className="text-[11px] text-[#141518] font-mono font-bold block mt-1">TOP 5% FLEET</span>
        </div>
      </div>
    </div>
  );
};

// ─── QuickActionGrid ─────────────────────────────────────────────────────────
export const QuickActionGrid: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'OFFERS FEED', path: '/rider/orders', icon: <ShoppingBag size={18} />, badge: '2 NEW' },
    { label: 'ACTIVE TASK', path: '/rider/active', icon: <Navigation size={18} />, badge: '#1809' },
    { label: 'WALLET HUB', path: '/rider/earnings', icon: <Wallet size={18} /> },
    { label: 'ALERTS', path: '/rider/alerts', icon: <Bell size={18} /> },
    { label: 'SOS EMERGENCY', path: '/rider/support', icon: <HelpCircle size={18} /> },
    { label: 'COURIER DOSSIER', path: '/rider/profile', icon: <User size={18} /> },
    { label: 'TODAY SHIFT', path: '/rider/today', icon: <Clock size={18} /> },
    { label: 'CONFIG', path: '/rider/settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#141518] shadow-[4px_4px_0px_#141518] space-y-3 text-left">
      <h4 className="text-xs font-mono font-black uppercase text-[#141518] tracking-wider">
        OPERATIONAL DISPATCH ACTIONS
      </h4>
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 font-mono">
        {actions.map((act) => (
          <button
            key={act.path}
            onClick={() => navigate(act.path)}
            className="p-2.5 sm:p-3 bg-[#FAF8F5] hover:bg-[#D7F04A]/25 border border-[#141518] shadow-[2px_2px_0px_#141518] flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative active:translate-x-[1px] active:translate-y-[1px]"
          >
            <div className="text-[#141518]">{act.icon}</div>
            <span className="text-[9px] font-bold text-[#141518] text-center uppercase tracking-wider truncate w-full">
              {act.label}
            </span>
            {act.badge && (
              <span className="absolute -top-1.5 -right-1 text-[8px] font-mono font-black px-1.5 py-0.2 bg-[#141518] text-[#D7F04A] border border-[#141518]">
                {act.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── AlertCard ───────────────────────────────────────────────────────────────
export const AlertCard: React.FC<{ alert: OperationalAlert; onDismiss: (id: string) => void }> = ({
  alert,
  onDismiss,
}) => {
  const navigate = useNavigate();

  const severityStyles = {
    critical: 'bg-[#FEE2E2] border-[#141518] text-[#991B1B]',
    warning: 'bg-[#FEF08A] border-[#141518] text-[#854D0E]',
    info: 'bg-[#E0E7FF] border-[#141518] text-[#3730A3]',
  };

  return (
    <div
      className={`p-4 border ${severityStyles[alert.severity]} shadow-[3px_3px_0px_#141518] text-left space-y-2 relative font-mono`}
    >
      <div className="flex items-start justify-between">
        <strong className="text-xs font-black uppercase block pr-6 text-[#141518]">
          {alert.title}
        </strong>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 border border-[#141518] bg-[#FAF8F5] text-[#141518] hover:bg-[#F3F0E8] cursor-pointer absolute top-3 right-3 shadow-[1px_1px_0px_#141518]"
        >
          <X size={12} />
        </button>
      </div>

      <p className="text-xs text-[#141518] leading-relaxed font-sans">{alert.message}</p>

      {alert.actionPath && alert.actionLabel && (
        <button
          onClick={() => navigate(alert.actionPath!)}
          className="text-xs font-mono font-bold text-[#141518] underline underline-offset-4 decoration-[#141518] hover:text-[#1B3BFF] block pt-1 cursor-pointer uppercase"
        >
          {alert.actionLabel} →
        </button>
      )}
    </div>
  );
};
