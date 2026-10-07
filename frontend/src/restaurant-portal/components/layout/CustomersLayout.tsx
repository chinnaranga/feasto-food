import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Users, Layers, ShieldAlert, FileText, Share2, ChevronRight } from 'lucide-react';
import PageContainer from './PageContainer';
import PortalPageHeader from '../common/PortalPageHeader';
import PortalLoader from '../common/PortalLoader';
import usePortalCustomerStore from '../../store/portalCustomerStore';

export const CustomersLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, segments } = usePortalCustomerStore();

  const isEditorPage = location.pathname.includes('/new') || /customers\/cust-/.test(location.pathname);

  // Counters
  const totalCount = customers.length;
  const atRiskCount = customers.filter(c => c.riskScore > 60).length;

  const sideNav = [
    { label: 'Customer Directory', path: '/restaurant-portal/customers', icon: <Users size={13} />, count: totalCount, end: true },
    { label: 'Dynamic Segments', path: '/restaurant-portal/customers/segments', icon: <Layers size={13} />, count: segments.length, end: false },
    { label: 'Retention & Winback', path: '/restaurant-portal/customers/retention', icon: <ShieldAlert size={13} />, count: atRiskCount, end: false },
    { label: 'Relationship Notes', path: '/restaurant-portal/customers/notes', icon: <FileText size={13} />, count: 0, end: false },
    { label: 'Outreach Consent', path: '/restaurant-portal/customers/communication', icon: <Share2 size={13} />, count: 0, end: false },
  ];

  return (
    <PageContainer className="pb-16 font-mono text-left">
      {/* Header */}
      <PortalPageHeader
        title="Guest Relationship Intelligence (CRM)"
        description="Monitor guest behavior, build segment rules, review lifetime customer values, and log staff notes or allergies."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/customers/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#141518] hover:bg-[#D7F04A] text-[#FAF8F5] hover:text-[#141518] text-xs font-bold uppercase tracking-wider border border-[#141518] shadow-[2px_2px_0px_#141518] transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Guest</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/customers')}
              className="inline-flex items-center gap-1 px-3 py-2 bg-[#FAF8F5] border border-[#141518]/20 hover:bg-[#141518] hover:text-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#141518] transition-colors cursor-pointer"
            >
              Back to CRM
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
            <span className="text-[9px] font-bold text-[#52555F] uppercase tracking-widest px-3 block mb-2 font-mono">
              CRM Navigation
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
                        node.label.includes('Retention') ? 'bg-red-50 text-red-800 border-red-300 animate-pulse' :
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

          {/* Active CRM outlet */}
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

export default CustomersLayout;
