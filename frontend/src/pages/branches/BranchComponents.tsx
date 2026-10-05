import React from 'react';
import {
  Store,
  MapPin,
  Clock,
  Users,
  Shield,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink,
  Phone,
  Mail,
  Sliders,
  Sparkles,
} from 'lucide-react';
import type {
  BranchProfile,
  BranchStatus,
  OperationalStatus,
  DayHours,
  SpecialClosure,
  DeliveryZone,
  BranchPerformanceMetric,
  BranchReadinessScore,
} from '../../types/branches';

// ─── BranchStatusBadge ───────────────────────────────────────────────────────
export const BranchStatusBadge: React.FC<{ status: BranchStatus }> = ({ status }) => {
  const styles: Record<BranchStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    inactive: 'bg-neutral-100 text-neutral-600 border-neutral-250',
    review_needed: 'bg-amber-50 text-amber-700 border-amber-200',
    launching: 'bg-blue-50 text-blue-700 border-blue-200',
    maintenance: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const labels: Record<BranchStatus, string> = {
    active: '● Active Outlet',
    inactive: 'Inactive',
    review_needed: '⚠️ Review Needed',
    launching: '🚀 Launching Soon',
    maintenance: '🔧 Maintenance',
  };

  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// ─── ReadinessBadge ──────────────────────────────────────────────────────────
export const ReadinessBadge: React.FC<{ scorePct: number }> = ({ scorePct }) => {
  const getStyle = (s: number) => {
    if (s >= 95) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s >= 80) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (s >= 70) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
  };

  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getStyle(scorePct)}`}>
      {scorePct}% Ready
    </span>
  );
};

// ─── BranchSummaryCard ───────────────────────────────────────────────────────
export interface BranchSummaryCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  statusTag?: string;
  statusVariant?: 'success' | 'warning' | 'neutral';
}

export const BranchSummaryCard: React.FC<BranchSummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  statusTag,
  statusVariant = 'neutral',
}) => {
  const statusStyles = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-3 hover:border-neutral-300 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 font-heading">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-neutral-100 text-neutral-600">{icon}</div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-neutral-900 font-mono leading-none">{value}</h3>
        {subtitle && <p className="text-[11px] text-neutral-500 font-medium mt-1.5">{subtitle}</p>}
      </div>

      {statusTag && (
        <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyles[statusVariant]}`}>
          {statusTag}
        </span>
      )}
    </div>
  );
};

// ─── BranchCard ──────────────────────────────────────────────────────────────
export const BranchCard: React.FC<{
  branch: BranchProfile;
  readinessPct?: number;
  onSelect: (id: string) => void;
  onToggleStatus: (id: string) => void;
}> = ({ branch, readinessPct = 95, onSelect, onToggleStatus }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left flex flex-col justify-between space-y-4 hover:border-neutral-300 transition-all">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase">{branch.code}</span>
              <ReadinessBadge scorePct={readinessPct} />
            </div>
            <h4 className="text-sm font-black text-neutral-900 font-heading">{branch.name}</h4>
          </div>
          <BranchStatusBadge status={branch.status} />
        </div>

        <div className="space-y-1.5 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-neutral-400 shrink-0" />
            <span className="truncate">{branch.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={13} className="text-neutral-400 shrink-0" />
            <span>Manager: <strong className="text-neutral-900">{branch.managerName}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-neutral-400">
            <Phone size={11} className="shrink-0" />
            <span>{branch.phone}</span>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
        <button
          onClick={() => onToggleStatus(branch.id)}
          className="text-xs font-bold text-neutral-500 hover:text-neutral-900 cursor-pointer"
        >
          {branch.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>

        <button
          onClick={() => onSelect(branch.id)}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>Manage Branch</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
};

// ─── BranchTable ─────────────────────────────────────────────────────────────
export const BranchTable: React.FC<{
  branches: BranchProfile[];
  readinessMap: Record<string, BranchReadinessScore>;
  onSelect: (id: string) => void;
}> = ({ branches, readinessMap, onSelect }) => {
  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200/80 text-[10px] font-black uppercase text-neutral-500 font-heading tracking-wider">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Branch Name</th>
              <th className="px-4 py-3">Region & City</th>
              <th className="px-4 py-3">Branch Manager</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Readiness</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700 font-sans">
            {branches.map((b) => {
              const score = readinessMap[b.id]?.overallReadinessPct || 85;
              return (
                <tr key={b.id} className="hover:bg-neutral-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-neutral-900">{b.code}</td>
                  <td className="px-4 py-3 font-bold text-neutral-900">{b.name}</td>
                  <td className="px-4 py-3 text-neutral-600">{b.region} • {b.city}</td>
                  <td className="px-4 py-3 font-medium text-neutral-800">{b.managerName}</td>
                  <td className="px-4 py-3">
                    <BranchStatusBadge status={b.status} />
                  </td>
                  <td className="px-4 py-3">
                    <ReadinessBadge scorePct={score} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onSelect(b.id)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold rounded-lg text-[11px] cursor-pointer"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── HoursCard ───────────────────────────────────────────────────────────────
export const HoursCard: React.FC<{
  hours: DayHours[];
  closures: SpecialClosure[];
  onAddClosure: () => void;
}> = ({ hours, closures, onAddClosure }) => {
  return (
    <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
        <div>
          <h4 className="text-sm font-black text-neutral-900 font-heading">Weekly Operating Hours</h4>
          <p className="text-xs text-neutral-500">Configure store, kitchen prep, and delivery window schedules.</p>
        </div>
        <button
          onClick={onAddClosure}
          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl cursor-pointer"
        >
          + Add Special Closure
        </button>
      </div>

      <div className="space-y-2 text-xs">
        {hours.map((h) => (
          <div key={h.day} className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-neutral-50 border border-neutral-150 gap-2">
            <span className="font-bold text-neutral-900 w-24">{h.day}</span>

            {h.isOpen ? (
              <div className="flex flex-wrap items-center gap-4 text-neutral-600 font-mono text-[11px]">
                <span>Store: <strong>{h.storeOpen} - {h.storeClose}</strong></span>
                <span>Kitchen: <strong>{h.kitchenOpen} - {h.kitchenClose}</strong></span>
                <span>Delivery: <strong>{h.deliveryOpen} - {h.deliveryClose}</strong></span>
              </div>
            ) : (
              <span className="text-red-600 font-bold uppercase text-[10px]">CLOSED TODAY</span>
            )}
          </div>
        ))}
      </div>

      {closures.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-neutral-100">
          <h5 className="text-xs font-black text-neutral-900 uppercase tracking-wider font-heading">
            Scheduled Special Closures & Holidays
          </h5>
          <div className="space-y-2">
            {closures.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs flex justify-between items-center">
                <div>
                  <strong className="text-amber-900 block">{c.title}</strong>
                  <span className="text-[11px] text-amber-700">
                    {c.startDate} to {c.endDate} • Reason: {c.reason}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 uppercase px-2 py-0.5 rounded bg-amber-100">
                  {c.affectsDelivery ? 'No Delivery' : 'Store Only'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DeliveryZoneCard ────────────────────────────────────────────────────────
export const DeliveryZoneCard: React.FC<{
  zone: DeliveryZone;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ zone, onToggleStatus, onDelete }) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="text-sm font-black text-neutral-900 font-heading">{zone.name}</h4>
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Radius: {zone.radiusKm} km</span>
        </div>
        <span className={`text-[9px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
          zone.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
          {zone.status}
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-neutral-400 uppercase block">Serviceable Postal Codes:</span>
        <div className="flex flex-wrap gap-1">
          {zone.serviceablePinCodes.map((code) => (
            <span key={code} className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-mono text-[10px]">
              {code}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600 font-mono">
        <span>Min Order: ₹{zone.minOrderAmount} • Fee: ₹{zone.deliveryFee}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => onToggleStatus(zone.id)} className="text-[#e35205] font-bold hover:underline cursor-pointer">
            {zone.status === 'active' ? 'Pause Zone' : 'Activate'}
          </button>
          <button onClick={() => onDelete(zone.id)} className="text-red-500 font-bold hover:underline cursor-pointer">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── BranchComparisonCard ────────────────────────────────────────────────────
export const BranchComparisonCard: React.FC<{ metrics: BranchPerformanceMetric[] }> = ({ metrics }) => {
  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-2xs overflow-hidden text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-neutral-50 border-b border-neutral-200/80 text-[10px] font-black uppercase text-neutral-500 font-heading tracking-wider">
            <tr>
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Branch Location</th>
              <th className="px-4 py-3">Daily Revenue</th>
              <th className="px-4 py-3">Daily Orders</th>
              <th className="px-4 py-3">AOV</th>
              <th className="px-4 py-3">Fulfillment Speed</th>
              <th className="px-4 py-3">Customer Rating</th>
              <th className="px-4 py-3">Staff Coverage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-700 font-sans">
            {metrics.map((m) => (
              <tr key={m.branchId} className="hover:bg-neutral-50/70 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-neutral-900">#{m.rank}</td>
                <td className="px-4 py-3 font-bold text-neutral-900">{m.branchName}</td>
                <td className="px-4 py-3 font-mono font-bold text-emerald-700">₹{m.dailyRevenue.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 font-mono text-neutral-900">{m.dailyOrders}</td>
                <td className="px-4 py-3 font-mono text-neutral-800">₹{m.avgOrderValue}</td>
                <td className="px-4 py-3 font-mono text-neutral-800">{m.fulfillmentSpeedMins} mins</td>
                <td className="px-4 py-3 font-bold text-amber-600">★ {m.customerRating}</td>
                <td className="px-4 py-3 font-mono text-neutral-800">{m.staffCoveragePct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── BranchReadinessCard ─────────────────────────────────────────────────────
export const BranchReadinessCard: React.FC<{ readiness: BranchReadinessScore; branchName: string }> = ({
  readiness,
  branchName,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs text-left space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-neutral-900 font-heading">{branchName}</h4>
          <span className="text-[10px] text-neutral-400 font-bold uppercase">Launch Readiness Status</span>
        </div>
        <ReadinessBadge scorePct={readiness.overallReadinessPct} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Profile</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.profileScorePct}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Hours</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.hoursScorePct}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Staff</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.staffScorePct}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Menu</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.menuScorePct}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Inventory</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.inventoryScorePct}%</span>
        </div>
        <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-150">
          <span className="text-[10px] font-bold text-neutral-400 uppercase block">Delivery</span>
          <span className="font-mono font-bold text-neutral-900">{readiness.deliveryScorePct}%</span>
        </div>
      </div>
    </div>
  );
};

// ─── BranchEmptyState ────────────────────────────────────────────────────────
export const BranchEmptyState: React.FC<{
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ title, description, actionLabel, onAction }) => (
  <div className="p-12 text-center bg-white rounded-2xl border border-neutral-200/90 shadow-2xs space-y-3">
    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
      <Store size={22} />
    </div>
    <h4 className="text-sm font-black text-neutral-900 font-heading">{title}</h4>
    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">{description}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
      >
        <span>{actionLabel}</span>
      </button>
    )}
  </div>
);

export default BranchSummaryCard;
