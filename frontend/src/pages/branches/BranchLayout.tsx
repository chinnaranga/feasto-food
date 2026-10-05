import React, { Suspense } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Store,
  MapPin,
  Clock,
  Users,
  Sliders,
  BarChart3,
  CheckCircle2,
  Plus,
  Compass,
  Globe,
} from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';

export const BranchLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { branches, selectedBranchId, setSelectedBranchId } = usePortalBranchesStore();

  const activeBranchesCount = branches.filter((b) => b.status === 'active').length;
  const reviewNeededCount = branches.filter((b) => b.status === 'review_needed').length;

  const currentBranch =
    selectedBranchId !== 'all' ? branches.find((b) => b.id === selectedBranchId) : null;

  const navTabs = [
    { label: 'Overview', path: '/restaurant/branches', icon: <Store size={14} /> },
    { label: 'Branch Directory', path: '/restaurant/branches/directory', icon: <MapPin size={14} /> },
    { label: 'Operating Hours', path: '/restaurant/branches/hours', icon: <Clock size={14} /> },
    { label: 'Staff & Menu Scopes', path: '/restaurant/branches/assignments', icon: <Users size={14} /> },
    { label: 'Delivery Radius Zones', path: '/restaurant/branches/zones', icon: <Compass size={14} /> },
    { label: 'Location Comparison', path: '/restaurant/branches/compare', icon: <BarChart3 size={14} /> },
    { label: 'Launch Readiness', path: '/restaurant/branches/readiness', icon: <CheckCircle2 size={14} /> },
    { label: 'Regional Settings', path: '/restaurant/branches/regional', icon: <Globe size={14} /> },
  ];

  return (
    <div className="space-y-6 text-left p-6 max-w-7xl mx-auto">
      {/* Top Banner Header */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              ● {activeBranchesCount} Active Locations Operational
            </span>
            {reviewNeededCount > 0 && (
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                ⚠️ {reviewNeededCount} Needs Review
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Multi-Branch Management, Location Operations & Regional Control
          </h2>
          <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
            Manage multi-outlet dining locations, store operating hours, staff & menu assignments, hyper-local delivery zones, and location performance comparisons across regions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Active Branch Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase text-neutral-400">Branch Scope:</span>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="bg-transparent text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer"
            >
              <option value="all">🌍 All Outlets ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Add Branch Action */}
          <button
            onClick={() => navigate('/restaurant/branches/new')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-3xs"
          >
            <Plus size={13} />
            <span>Add New Branch</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tab Bar */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs overflow-x-auto scrollbar-none">
        <div className="flex gap-1 min-w-max">
          {navTabs.map((tab) => {
            const isActive =
              location.pathname === tab.path ||
              (tab.path === '/restaurant/branches' && location.pathname === '/restaurant/branches/');
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-3xs'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <span className={isActive ? 'text-[#e35205]' : 'text-neutral-400'}>{tab.icon}</span>
                <span>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Sub-Route View */}
      <Suspense fallback={<div className="py-16 text-center text-xs font-bold text-neutral-400 animate-pulse">Loading Branch Operations...</div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default BranchLayout;
