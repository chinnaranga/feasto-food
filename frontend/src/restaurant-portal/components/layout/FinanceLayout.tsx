import React, { useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Landmark,
  Receipt,
  ShoppingBag,
  RotateCcw,
  GitCompare,
  Percent,
  Download,
  Calendar,
  Building2,
} from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import usePortalFinanceStore, { DateRangePreset } from '../../store/portalFinanceStore';
import { usePortalStore } from '../../store/portalStore';

export const FinanceLayout: React.FC = () => {
  const location = useLocation();
  const { dateRangePreset, setDateRangePreset, selectedBranchId, setSelectedBranchId, initializeFinanceSync } =
    usePortalFinanceStore();
  const { restaurants, selectedRestaurant, selectRestaurant } = usePortalStore();

  useEffect(() => {
    const unsub = initializeFinanceSync();
    return () => unsub();
  }, [initializeFinanceSync]);

  const navItems = [
    { label: 'Executive Dashboard', path: '/restaurant-portal/finance/dashboard', icon: <LayoutDashboard size={14} /> },
    { label: 'Subscriptions & Billing', path: '/restaurant-portal/finance/billing', icon: <CreditCard size={14} /> },
    { label: 'Invoices Hub', path: '/restaurant-portal/finance/invoices', icon: <FileText size={14} /> },
    { label: 'Payouts & Settlements', path: '/restaurant-portal/finance/payouts', icon: <Landmark size={14} /> },
    { label: 'Taxes & GST', path: '/restaurant-portal/finance/taxes', icon: <Receipt size={14} /> },
    { label: 'Expenses Log', path: '/restaurant-portal/finance/expenses', icon: <ShoppingBag size={14} /> },
    { label: 'Refunds & Adjustments', path: '/restaurant-portal/finance/refunds', icon: <RotateCcw size={14} /> },
    { label: 'Reconciliation', path: '/restaurant-portal/finance/reconciliation', icon: <GitCompare size={14} /> },
    { label: 'Commissions & Fees', path: '/restaurant-portal/finance/fees', icon: <Percent size={14} /> },
  ];

  const handleExportReport = () => {
    alert(`Preparing financial audit package (PDF/CSV) for ${selectedRestaurant?.name || 'All Branches'} (${dateRangePreset.toUpperCase()})...`);
  };

  return (
    <PageContainer className="pb-16 text-left select-none">
      {/* Primary Page Header */}
      <PortalPageHeader
        title="Accounting, Billing & Financial Operations"
        description="Monitor revenue settlements, manage merchant subscription billing, issue invoices, track GST/VAT taxes, reconcile transaction gateways, and audit fee structures."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-neutral-200 hover:bg-neutral-50 bg-white rounded-xl text-xs font-black uppercase tracking-wider text-neutral-700 transition-colors cursor-pointer shadow-3xs"
            >
              <Download size={13} className="text-[#e35205]" />
              <span>Export Audit Report</span>
            </button>
          </div>
        }
      />

      {/* Roster & Date Range Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-4 mt-6">
        {/* Branch Selector */}
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-neutral-400 shrink-0" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Branch Context:</span>
          <select
            value={selectedRestaurant?.id || selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              selectRestaurant(e.target.value);
            }}
            className="px-3 py-1.5 bg-white border border-neutral-200 focus:border-[#e35205] focus:outline-none rounded-xl text-xs font-bold text-neutral-700 cursor-pointer shadow-3xs"
          >
            <option value="all">All Branches (Consolidated)</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.branchCode})
              </option>
            ))}
          </select>
        </div>

        {/* Date Preset Selector */}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-neutral-400 shrink-0" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Timeframe:</span>
          <div className="flex p-0.5 bg-neutral-100/80 rounded-xl border border-neutral-200/60">
            {(['today', 'week', 'month', 'quarter', 'ytd'] as DateRangePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setDateRangePreset(preset)}
                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                  dateRangePreset === preset
                    ? 'bg-white text-neutral-800 shadow-3xs'
                    : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none py-3 border-b border-neutral-200/80 -mx-4 px-4 sm:mx-0 sm:px-0">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path.endsWith('/dashboard') && location.pathname === '/restaurant-portal/finance');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-3xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
              }`}
            >
              <span className={isActive ? 'text-[#e35205]' : 'text-neutral-400'}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Active Sub-Route Content */}
      <div className="mt-6">
        <Outlet />
      </div>
    </PageContainer>
  );
};

export default FinanceLayout;
