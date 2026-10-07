import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Download, LayoutGrid, DollarSign, Award, Clock, Wheat, Users, ShieldAlert, Kanban, CalendarRange, ChevronRight } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import PortalLoader from '../common/PortalLoader';
import usePortalAnalyticsStore from '../../store/portalAnalyticsStore';

export const AnalyticsLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dateRangePreset, setDateRangePreset, branch, setBranch, comparisonMode, toggleComparisonMode } = usePortalAnalyticsStore();

  const sideNav = [
    { label: 'Executive Overview', path: '/restaurant-portal/analytics', icon: <LayoutGrid size={13} />, end: true },
    { label: 'Sales & Revenue', path: '/restaurant-portal/analytics/sales', icon: <DollarSign size={13} />, end: false },
    { label: 'Menu Performance', path: '/restaurant-portal/analytics/menu', icon: <Award size={13} />, end: false },
    { label: 'Kitchen & Operations', path: '/restaurant-portal/analytics/operations', icon: <Clock size={13} />, end: false },
    { label: 'Inventory Turnover', path: '/restaurant-portal/analytics/inventory', icon: <Wheat size={13} />, end: false },
    { label: 'Staff Productivity', path: '/restaurant-portal/analytics/staff', icon: <Users size={13} />, end: false },
    { label: 'Financial Margins', path: '/restaurant-portal/analytics/finance', icon: <ShieldAlert size={13} />, end: false },
    { label: 'Branch Comparison', path: '/restaurant-portal/analytics/branches', icon: <Kanban size={13} />, end: false },
    { label: 'Rush Hour Heatmap', path: '/restaurant-portal/analytics/time', icon: <CalendarRange size={13} />, end: false },
  ];

  const handleExport = () => {
    alert('Preparing operational intelligence report export (CSV/PDF) for the current active filter limits...');
  };

  return (
    <PageContainer className="pb-16 text-left font-mono">
      {/* Primary page header */}
      <PortalPageHeader
        title="Business Intelligence & Analytics"
        description="Monitor sales trendlines, analyze high-margin dishes, track kitchen preparation delays, and optimize branch staffing schedules."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#141518] hover:bg-[#D7F04A] bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer shadow-[2px_2px_0px_#141518]"
            >
              <Download size={13} />
              <span>Export Report</span>
            </button>
          </div>
        }
      />

      {/* Roster Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#141518]/15 pb-4 mt-6">
        {/* Branch Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#52555F] uppercase tracking-wider">Branch Filter:</span>
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value as any)}
            className="px-3 py-1.5 bg-[#FAF8F5] border border-[#141518]/20 focus:border-[#141518] focus:outline-none text-xs font-bold text-[#141518] cursor-pointer"
          >
            <option value="all">All Branches</option>
            <option value="Downtown Flagship">Downtown Flagship</option>
            <option value="Suburbs Cloud Kitchen">Suburbs Cloud Kitchen</option>
          </select>
        </div>

        {/* Date Filters & WoW Comparisons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Time presets */}
          <div className="bg-[#FAF8F5] p-0.5 flex items-center border border-[#141518]/20">
            {(['today', '7d', '30d'] as const).map((preset) => (
              <button
                key={preset}
                onClick={() => setDateRangePreset(preset)}
                className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  dateRangePreset === preset
                    ? 'bg-[#141518] text-[#D7F04A]'
                    : 'text-[#52555F] hover:text-[#141518]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Compare WoW */}
          <button
            onClick={toggleComparisonMode}
            className={`px-3 py-1.5 border text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              comparisonMode
                ? 'bg-[#141518] text-[#D7F04A] border-[#141518] shadow-[2px_2px_0px_#141518]'
                : 'bg-[#FAF8F5] text-[#52555F] border-[#141518]/20 hover:border-[#141518]'
            }`}
          >
            Compare WoW
          </button>
        </div>
      </div>

      {/* Main layout contents */}
      <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start">
        {/* Sidebar sub-nav list */}
        <aside className="w-full lg:w-64 shrink-0 space-y-1.5 select-none bg-[#FAF8F5] border border-[#141518]/15 p-3 shadow-[4px_4px_0px_#141518]">
          <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-widest px-3 block mb-2">
            Intelligence Categories
          </span>
          <nav className="space-y-1">
            {sideNav.map((node) => (
              <NavLink
                key={node.path}
                to={node.path}
                end={node.end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 text-xs font-mono transition-colors cursor-pointer justify-between ${
                    isActive
                      ? 'bg-[#141518] text-[#FAF8F5] font-bold border-l-2 border-[#D7F04A]'
                      : 'text-[#52555F] hover:bg-[#EBE7DD] hover:text-[#141518]'
                  }`
                }
              >
                <div className="flex items-center gap-2">
                  {node.icon}
                  <span>{node.label}</span>
                </div>
                <ChevronRight size={10} className="text-[#52555F]" />
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Dynamic Analytics content workspace panel */}
        <div className="flex-1 w-full bg-[#FAF8F5] border border-[#141518]/15 shadow-[4px_4px_0px_#141518] p-6 min-h-[500px]">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </PageContainer>
  );
};

export default AnalyticsLayout;
