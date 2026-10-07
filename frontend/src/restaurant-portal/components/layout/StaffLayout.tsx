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
    <PageContainer className="pb-16 font-mono text-left">
      {/* Page Header */}
      <PortalPageHeader
        title="Staff & Shift Operations"
        description="Roster employees, configure granular role permission locks, schedule weekly slots, and review throughput telemetry."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/staff/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Roster Staff</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/staff')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 hover:bg-[#141518] hover:text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer"
            >
              Back to Roster
            </button>
          )
        }
      />

      {isEditorPage ? (
        <div className="w-full mt-6">
          <Suspense fallback={<PortalLoader />}>
            <Outlet />
          </Suspense>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 mt-6 items-start text-left">
          {/* Sub Navigation Sidebar */}
          <aside className="w-full lg:w-64 shrink-0 space-y-1.5 select-none bg-[#FAF8F5] border border-[#141518]/15 p-3 shadow-[4px_4px_0px_#141518]">
            <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-widest px-3 block mb-2">
              Staffing Scopes
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
                  
                  <div className="flex items-center gap-1">
                    {node.count > 0 && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border ${
                        node.label.includes('Attendance') ? 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse' :
                        'bg-[#141518]/10 text-[#141518] border-[#141518]/15'
                      }`}>
                        {node.count}
                      </span>
                    )}
                    <ChevronRight size={10} className="text-[#52555F]" />
                  </div>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Active staff outlet */}
          <div className="flex-1 w-full bg-[#FAF8F5] border border-[#141518]/15 shadow-[4px_4px_0px_#141518] p-6 min-h-[500px]">
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
