import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Users, ShieldAlert, Calendar, CheckSquare, BarChart3, ChevronRight } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import PortalLoader from '../common/PortalLoader';
import usePortalStaffStore from '../../store/portalStaffStore';

export const StaffLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { staff, shifts } = usePortalStaffStore();

  const isEditorPage = location.pathname.includes('/new') || /staff\/staff-/.test(location.pathname);

  // Statistics counters
  const totalCount = staff.length;
  const activeCount = staff.filter((s) => s.status === 'active').length;
  const onShiftNow = staff.filter((s) => s.attendance === 'present' || s.attendance === 'late').length;
  const lateCount = staff.filter((s) => s.attendance === 'late').length;

  const sideNav = [
    { label: 'Staff Roster Directory', path: '/restaurant-portal/staff', icon: <Users size={13} />, count: totalCount, end: true },
    { label: 'Roles & Access Rights', path: '/restaurant-portal/staff/roles', icon: <ShieldAlert size={13} />, count: 0, end: false },
    { label: 'Shift Scheduling Slots', path: '/restaurant-portal/staff/shifts', icon: <Calendar size={13} />, count: shifts.length, end: false },
    { label: 'Attendance Tracker', path: '/restaurant-portal/staff/attendance', icon: <CheckSquare size={13} />, count: lateCount > 0 ? lateCount : 0, end: false },
    { label: 'Performance Statistics', path: '/restaurant-portal/staff/performance', icon: <BarChart3 size={13} />, count: 0, end: false },
  ];

  return (
    <PageContainer className="pb-16">
      {/* Page Header */}
      <PortalPageHeader
        title="Staff & Shift Operations"
        description="Roster employees, configure granular role permission locks, schedule weekly slots, and review throughput telemetry."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/staff/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Roster Staff</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/staff')}
              className="inline-flex items-center gap-1 px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
            >
              Back to Roster
            </button>
          )
        }
      />

      {isEditorPage ? (
        /* Full width editor display */
        <div className="w-full mt-6">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        /* Split view: Sidebar on left, Outlet on right */
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
          
          {/* Sub Navigation Sidebar */}
          <aside className="w-full lg:w-60 shrink-0 space-y-1.5 select-none bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-3.5 block mb-2">
              Staffing Scopes
            </span>
            <nav className="space-y-0.5">
              {sideNav.map((node) => (
                <NavLink
                  key={node.path}
                  to={node.path}
                  end={node.end}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer justify-between ${
                      isActive
                        ? 'bg-neutral-50 text-[#e35205] border border-neutral-200/50 shadow-3xs'
                        : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {node.icon}
                    <span>{node.label}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {node.count > 0 && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        node.label.includes('Attendance') ? 'bg-amber-100 text-amber-700 animate-pulse' :
                        'bg-neutral-100 text-neutral-500'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-neutral-300" />
                  </div>
                </NavLink>
              ))}
            </nav>

            {/* Sidebar quick status stats */}
            <div className="border-t border-neutral-100 pt-3 mt-4 px-3 space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-semibold text-neutral-400 uppercase">On Shift</span>
                <span className="font-bold text-emerald-600">{onShiftNow} present</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-semibold text-neutral-400 uppercase">Active Roster</span>
                <span className="font-bold text-neutral-600">{activeCount} / {totalCount}</span>
              </div>
            </div>
          </aside>

          {/* Active staff pane view */}
          <div className="flex-1 w-full bg-white border border-neutral-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 min-h-[500px]">
            <Suspense fallback={<PortalLoader />}>
              <Outlet />
            </Suspense>
          </div>

        </div>
      )}
    </PageContainer>
  );
};

export default StaffLayout;
