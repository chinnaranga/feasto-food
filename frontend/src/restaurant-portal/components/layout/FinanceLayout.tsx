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
    <PageContainer className="pb-16 text-left select-none font-mono">
      {/* Primary Page Header */}
      <PortalPageHeader
        title="Accounting, Billing & Financial Operations"
        description="Monitor revenue settlements, manage merchant subscription billing, issue invoices, track GST/VAT taxes, reconcile transaction gateways, and audit fee structures."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#141518] hover:bg-[#D7F04A] bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer shadow-[2px_2px_0px_#141518]"
            >
              <Download size={13} className="text-[#1B3BFF]" />
              <span>Export Audit Report</span>
            </button>
          </div>
        }
      />

      {/* Roster & Date Range Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#141518]/15 pb-4 mt-6">
        {/* Branch Selector */}
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-[#52555F] shrink-0" />
          <span className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">Branch Context:</span>
          <select
            value={selectedRestaurant?.id || selectedBranchId}
            onChange={(e) => {
              setSelectedBranchId(e.target.value);
              selectRestaurant(e.target.value);
            }}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs font-bold text-[#141518] cursor-pointer"
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
          <Calendar size={14} className="text-[#52555F] shrink-0" />
          <span className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">Timeframe:</span>
          <div className="flex p-0.5 bg-[#FAF8F5] border border-[#141518]/20">
            {(['today', 'week', 'month', 'quarter', 'ytd'] as DateRangePreset[]).map((preset) => (
              <button
                key={preset}
                onClick={() => setDateRangePreset(preset)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  dateRangePreset === preset
                    ? 'bg-[#141518] text-[#D7F04A]'
                    : 'text-[#52555F] hover:text-[#141518]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-none py-3 border-b border-[#141518]/15 -mx-4 px-4 sm:mx-0 sm:px-0">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path.endsWith('/dashboard') && location.pathname === '/restaurant-portal/finance');
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#141518] text-[#FAF8F5] border-[#141518] shadow-[2px_2px_0px_#141518]'
                  : 'bg-[#FAF8F5] text-[#52555F] border-[#141518]/15 hover:border-[#141518] hover:text-[#141518]'
              }`}
            >
              <span className={isActive ? 'text-[#D7F04A]' : 'text-[#52555F]'}>{item.icon}</span>
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
