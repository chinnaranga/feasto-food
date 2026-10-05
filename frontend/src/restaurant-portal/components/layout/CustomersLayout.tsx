import React, { Suspense } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Users, Layers, ShieldAlert, FileText, Share2, ChevronRight, Sparkles } from 'lucide-react';
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
  const vipCount = customers.filter(c => c.loyaltyStatus === 'VIP').length;
  const dormantCount = customers.filter(c => c.loyaltyStatus === 'Dormant').length;
  const atRiskCount = customers.filter(c => c.riskScore > 60).length;

  const sideNav = [
    { label: 'Customer Directory', path: '/restaurant-portal/customers', icon: <Users size={13} />, count: totalCount, end: true },
    { label: 'Dynamic Segments', path: '/restaurant-portal/customers/segments', icon: <Layers size={13} />, count: segments.length, end: false },
    { label: 'Retention & Winback', path: '/restaurant-portal/customers/retention', icon: <ShieldAlert size={13} />, count: atRiskCount, end: false },
    { label: 'Relationship Notes', path: '/restaurant-portal/customers/notes', icon: <FileText size={13} />, count: 0, end: false },
    { label: 'Outreach Consent', path: '/restaurant-portal/customers/communication', icon: <Share2 size={13} />, count: 0, end: false },
  ];

  return (
    <PageContainer className="pb-16">
      {/* Header */}
      <PortalPageHeader
        title="Guest Relationship Intelligence (CRM)"
        description="Monitor guest behavior, build segment rules, review lifetime customer values, and log staff notes or allergies."
        actions={
          !isEditorPage ? (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/customers/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#e35205] hover:bg-[#c94804] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Guest</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/restaurant-portal/customers')}
              className="inline-flex items-center gap-1 px-3 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-black uppercase tracking-wider text-neutral-600 transition-colors cursor-pointer"
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
          <aside className="w-full lg:w-64 shrink-0 space-y-1.5 select-none bg-white border border-neutral-200/80 rounded-2xl p-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest px-3.5 block mb-2 font-heading">
              CRM Navigation
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
                        node.label.includes('Retention') ? 'bg-red-50 text-red-650 animate-pulse border border-red-100' :
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
            <div className="border-t border-neutral-100 pt-4 mt-4 px-3 space-y-3">
              <div>
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-wider font-heading">Loyalty Distribution</p>
                <div className="flex justify-between items-center text-[10px] mt-1.5">
                  <span className="font-semibold text-neutral-500">VIP Clients</span>
                  <span className="font-bold text-[#e35205]">{vipCount} guests</span>
                </div>
                <div className="flex justify-between items-center text-[10px] mt-1">
                  <span className="font-semibold text-neutral-500">Dormant Regulars</span>
                  <span className="font-bold text-neutral-600">{dormantCount} inactive</span>
                </div>
              </div>

              {/* Churn alert trigger suggestion */}
              {atRiskCount > 0 && (
                <div className="p-2.5 bg-red-50/50 border border-red-100 rounded-xl flex gap-2">
                  <Sparkles size={11} className="text-red-650 mt-0.5 shrink-0" />
                  <p className="text-[9px] text-red-750 leading-relaxed font-semibold">
                    {atRiskCount} VIPs show churn risk signal. Review Win-Back suggestions.
                  </p>
                </div>
              )}
            </div>
          </aside>

          {/* Active CRM panel view */}
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

export default CustomersLayout;
