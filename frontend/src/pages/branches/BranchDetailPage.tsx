import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Store, MapPin, Users, Clock, Phone, Mail, CheckCircle2, Shield, Settings } from 'lucide-react';
import usePortalBranchesStore from '../../store/portal/portalBranchesStore';
import { BranchStatusBadge, ReadinessBadge } from './BranchComponents';

export const BranchDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { branches, readinessScores, updateBranchProfile, toggleBranchStatus } = usePortalBranchesStore();

  const branch = branches.find((b) => b.id === id) || branches[0];
  const readiness = readinessScores[branch.id] || { overallReadinessPct: 95 };

  return (
    <div className="space-y-6 text-left">
      {/* Branch Header Overview */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-neutral-400 uppercase">{branch.code}</span>
              <ReadinessBadge scorePct={readiness.overallReadinessPct} />
            </div>
            <h3 className="text-xl font-black text-neutral-900 font-heading">{branch.name}</h3>
          </div>

          <div className="flex items-center gap-2">
            <BranchStatusBadge status={branch.status} />
            <button
              onClick={() => toggleBranchStatus(branch.id)}
              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold rounded-xl cursor-pointer"
            >
              {branch.status === 'active' ? 'Deactivate Outlet' : 'Activate Outlet'}
            </button>
          </div>
        </div>

        {/* Identity Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Street Address</span>
            <div className="flex items-start gap-1.5 text-neutral-800 font-medium">
              <MapPin size={14} className="text-neutral-400 shrink-0 mt-0.5" />
              <span>{branch.address}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Branch Manager</span>
            <div className="flex items-center gap-1.5 text-neutral-800 font-bold">
              <Users size={14} className="text-neutral-400 shrink-0" />
              <span>{branch.managerName}</span>
            </div>
            <span className="text-[11px] text-neutral-500 font-mono block">{branch.managerEmail}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-150 space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase block">Regional Metadata</span>
            <span className="text-neutral-800 font-bold block">{branch.region}</span>
            <span className="text-[11px] text-neutral-500 block">{branch.timezone} • {branch.currency}</span>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => navigate('/restaurant/branches/hours')}
            className="px-3.5 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 cursor-pointer"
          >
            Configure Hours
          </button>
          <button
            onClick={() => navigate('/restaurant/branches/assignments')}
            className="px-3.5 py-2 bg-neutral-100 text-neutral-800 rounded-xl hover:bg-neutral-200 cursor-pointer"
          >
            Staff & Menu Scopes
          </button>
          <button
            onClick={() => navigate('/restaurant/branches/zones')}
            className="px-3.5 py-2 bg-neutral-100 text-neutral-800 rounded-xl hover:bg-neutral-200 cursor-pointer"
          >
            Delivery Zones
          </button>
        </div>
      </div>
    </div>
  );
};

export default BranchDetailPage;
