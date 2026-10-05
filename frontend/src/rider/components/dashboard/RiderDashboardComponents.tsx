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
import type { RiderDutyState, DailyOperationalSummary, OperationalAlert, TodayShiftSchedule, RiderActivityItem } from '../../types/dashboard';
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
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 z-[400] px-4 py-3 select-none">
      <div className="max-w-lg mx-auto flex items-center justify-between gap-3">
        {/* Left: Brand & Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDrawer}
            className="p-2 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer active:scale-95"
            aria-label="Open drawer"
          >
            <span className="text-lg">☰</span>
          </button>

          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/rider/dashboard')}>
            <span className="text-sm font-black text-neutral-900 tracking-tight font-heading">
              Feasto<span className="text-[#e35205]">Rider</span>
            </span>
            <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
              RDR-8802
            </span>
          </div>
        </div>

        {/* Right: Duty Switcher & Alerts Bell */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDuty}
            className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs flex items-center gap-1.5 ${
              dutyState === 'online'
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : dutyState === 'break_mode'
                ? 'bg-amber-500 text-white'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-700'
            }`}
          >
            <Power size={13} />
            <span>{dutyState === 'online' ? 'On Duty' : dutyState === 'break_mode' ? 'Paused' : 'Off Duty'}</span>
          </button>

          <button
            onClick={() => navigate('/rider/alerts')}
            className="p-2 rounded-xl text-neutral-600 hover:bg-neutral-100 relative transition-colors cursor-pointer"
            aria-label="Alerts"
          >
            <Bell size={18} />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e35205]" />
            )}
          </button>
        </div>
      </div>

      {/* Zone Sub-Banner */}
      <div className="max-w-lg mx-auto pt-2 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-[#e35205]" />
          <span>Zone: <strong className="text-neutral-800">{assignedZone}</strong></span>
        </div>
        <span className="text-emerald-700 font-mono font-bold">★ 4.92 Rating</span>
      </div>
    </header>
  );
};

// ─── DashboardSubNavTabBar ───────────────────────────────────────────────────
export const DashboardSubNavTabBar: React.FC = () => {
  const tabs = [
    { label: 'Home', path: '/rider/dashboard' },
    { label: 'Today Shift', path: '/rider/today' },
    { label: 'Alerts', path: '/rider/alerts' },
    { label: 'Summary', path: '/rider/summary' },
    { label: 'Overview', path: '/rider/overview' },
  ];

  return (
    <div className="w-full bg-white border-y border-neutral-200/80 px-2 py-2 overflow-x-auto scrollbar-none text-left select-none">
      <div className="flex items-center gap-1 min-w-max">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/rider/dashboard'}
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

// ─── StatusToggleCard ────────────────────────────────────────────────────────
export const StatusToggleCard: React.FC<{
  dutyState: RiderDutyState;
  assignedZone: string;
  onToggle: () => void;
  onToggleBreak: () => void;
}> = ({ dutyState, assignedZone, onToggle, onToggleBreak }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4 text-left">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">Current Operational Duty</span>
          <h3 className="text-base font-black text-neutral-900 font-heading">
            {dutyState === 'online'
              ? 'You are On Duty'
              : dutyState === 'break_mode'
              ? 'Shift Paused (Break Mode)'
              : 'You are Off Duty'}
          </h3>
        </div>

        <span
          className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
            dutyState === 'online'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : dutyState === 'break_mode'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-neutral-100 text-neutral-600 border-neutral-250'
          }`}
        >
          {dutyState === 'online' ? '● ON DUTY' : dutyState === 'break_mode' ? '⏸ PAUSED' : 'OFF DUTY'}
        </span>
      </div>

      <p className="text-xs text-neutral-600 leading-relaxed">
        {dutyState === 'online'
          ? `Receiving instant order dispatches near ${assignedZone}.`
          : dutyState === 'break_mode'
          ? 'Deliveries are temporarily paused. Resume anytime.'
          : 'Turn On Duty to start receiving delivery offers in your zone.'}
      </p>

      <div className="grid grid-cols-2 gap-2">
        <RiderButton
          variant={dutyState === 'online' ? 'outline' : 'primary'}
          size="md"
          fullWidth
          onClick={onToggle}
        >
          {dutyState === 'online' ? 'Go Off Duty' : 'Go On Duty Now'}
        </RiderButton>

        <RiderButton
          variant={dutyState === 'break_mode' ? 'primary' : 'outline'}
          size="md"
          fullWidth
          onClick={onToggleBreak}
        >
          {dutyState === 'break_mode' ? 'Resume Deliveries' : 'Pause (Break Mode)'}
        </RiderButton>
      </div>
    </div>
  );
};

// ─── DailySummaryCard ────────────────────────────────────────────────────────
export const DailySummaryCard: React.FC<{ summary: DailyOperationalSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-[10px] font-black uppercase tracking-wider font-heading">Today's Earnings</span>
          <div className="p-1.5 rounded-lg bg-[#e35205]/10 text-[#e35205]">
            <Wallet size={16} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 font-mono leading-none">
            ₹{summary.todayEarnings.toFixed(0)}
          </h4>
          <span className="text-[11px] text-neutral-500 block mt-1">₹{summary.todayTips} tips included</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-[10px] font-black uppercase tracking-wider font-heading">Trips Completed</span>
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <TrendingUp size={16} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 font-mono leading-none">
            {summary.todayTrips} Orders
          </h4>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">
            {summary.acceptanceRatePct}% Acceptance SLA
          </span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-[10px] font-black uppercase tracking-wider font-heading">Active Shift Time</span>
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Clock size={16} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 font-mono leading-none">
            5.8 Hrs
          </h4>
          <span className="text-[11px] text-neutral-500 block mt-1">94% On-Time SLA</span>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-neutral-400">
          <span className="text-[10px] font-black uppercase tracking-wider font-heading">Partner Rating</span>
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
            <Award size={16} />
          </div>
        </div>
        <div>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-900 font-mono leading-none">
            ★ 4.92
          </h4>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">Top 5% Partner</span>
        </div>
      </div>
    </div>
  );
};

// ─── QuickActionGrid ─────────────────────────────────────────────────────────
export const QuickActionGrid: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { label: 'Offers Feed', path: '/rider/orders', icon: <ShoppingBag size={20} />, badge: '2 New' },
    { label: 'Active Task', path: '/rider/active', icon: <Navigation size={20} />, badge: '#1809' },
    { label: 'Rider Wallet', path: '/rider/earnings', icon: <Wallet size={20} /> },
    { label: 'Alerts', path: '/rider/alerts', icon: <Bell size={20} /> },
    { label: 'SOS Help', path: '/rider/support', icon: <HelpCircle size={20} /> },
    { label: 'Profile Hub', path: '/rider/profile', icon: <User size={20} /> },
    { label: 'Today Shift', path: '/rider/today', icon: <Clock size={20} /> },
    { label: 'App Settings', path: '/rider/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-3 text-left">
      <h4 className="text-xs font-black uppercase text-neutral-900 font-heading">Operational Quick Actions</h4>
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {actions.map((act) => (
          <button
            key={act.path}
            onClick={() => navigate(act.path)}
            className="p-2.5 sm:p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100/90 border border-neutral-200/80 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer relative active:scale-95 shadow-3xs"
          >
            <div className="text-[#e35205]">{act.icon}</div>
            <span className="text-[10px] font-bold text-neutral-800 text-center leading-snug truncate w-full">
              {act.label}
            </span>
            {act.badge && (
              <span className="absolute -top-1.5 -right-1 text-[8px] font-black px-1.5 py-0.2 rounded-full bg-[#e35205] text-white shadow-3xs">
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
    critical: 'bg-red-50 border-red-200 text-red-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  return (
    <div className={`p-4 rounded-2xl border ${severityStyles[alert.severity]} text-left space-y-2 relative`}>
      <div className="flex items-start justify-between">
        <strong className="text-xs font-bold block pr-6">{alert.title}</strong>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1 rounded-full hover:bg-black/5 text-neutral-400 cursor-pointer absolute top-3 right-3"
        >
          <X size={14} />
        </button>
      </div>

      <p className="text-xs text-neutral-700 leading-relaxed">{alert.message}</p>

      {alert.actionPath && alert.actionLabel && (
        <button
          onClick={() => navigate(alert.actionPath!)}
          className="text-xs font-bold text-[#e35205] hover:underline block pt-1 cursor-pointer"
        >
          {alert.actionLabel} →
        </button>
      )}
    </div>
  );
};
